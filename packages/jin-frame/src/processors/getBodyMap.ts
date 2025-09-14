import type { IBodyField } from '#interfaces/field/body/IBodyField';
import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import { getBodyField } from '#processors/getBodyField';
import { getObjectBodyField } from '#processors/getObjectBodyField';
import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';
import { recursive } from 'merge';
import { atOrThrow } from 'my-easy-fp';

export function getBodyMap<T extends Record<string, unknown>>(
  thisFrame: T,
  fields: IBodyField[],
): Record<string, unknown> | TSupportPrimitiveType | TSupportArrayType | unknown[] {
  const bodies: unknown[] = [];
  const objectBodies: unknown[] = [];

  const classifed = fields.reduce<{
    bodies: { key: string; option: IBodyFieldOption }[];
    objectBodies: { key: string; option: IObjectBodyFieldOption }[];
  }>(
    (aggregated, field) => {
      const { option } = field;

      if (option.type === 'body') {
        aggregated.bodies.push({ key: field.key, option });
      } else {
        aggregated.objectBodies.push({ key: field.key, option });
      }

      return aggregated;
    },
    {
      bodies: [],
      objectBodies: [],
    },
  );

  classifed.objectBodies = classifed.objectBodies.sort((l, r) => l.option.order - r.option.order);

  for (const field of classifed.bodies) {
    bodies.push(getBodyField(thisFrame, { key: field.key, option: field.option }));
  }

  for (const field of classifed.objectBodies) {
    objectBodies.push(getObjectBodyField(thisFrame, { key: field.key, option: field.option }));
  }

  // ------------------------------------------------------------------------------------
  // merge.recursive 함수는 primitive type array, user defined type array, primitive 타입을
  // merge 할 수 없다. 그래서 objectBody로 위에 열거한 3가지 형식이 전달될 경우, 별도의 처리가 필요하다.
  // 또한 의도적으로 위에 열거한 3가지 형식을 먼저 처리한다. 즉, 기본 자료형을 먼저 처리하는 것을 원칙으로 한다.
  // ------------------------------------------------------------------------------------
  // primitive type array
  const primitiveTypes = objectBodies.filter((item): item is TSupportArrayType => isValidPrimitiveType(item));

  if (primitiveTypes.length > 0) {
    return atOrThrow(primitiveTypes, 0);
  }

  // ObjectBody에서 배열은 하나만 처리할 수 있다. 그래서 ObjectBody 인데 배열이 있는 경우, 배열을 전부 합쳐서 반환한다
  // 반면 Body는 이름으로 배열을 분리하기 때문에 여러개를 처리할 수 있다
  const customArrayTypes = objectBodies.filter((item): item is unknown[] => Array.isArray(item));
  if (customArrayTypes.length > 0) {
    return customArrayTypes.reduce<unknown[]>((merged, item) => [...merged, ...item], []);
  }
  // ------------------------------------------------------------------------------------

  return recursive(...bodies, ...objectBodies) as Record<string, unknown>;
  // return recursive(bodies) as Record<string, unknown>;
}
