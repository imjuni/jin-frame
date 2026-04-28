import type { BodyFieldOption } from '#interfaces/field/body/BodyFieldOption';
import type { ObjectBodyFieldOption } from '#interfaces/field/body/ObjectBodyFieldOption';
import { getBodyField } from '#processors/getBodyField';
import { getObjectBodyField } from '#processors/getObjectBodyField';
import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import type { SupportArrayType } from '#tools/type-utilities/SupportArrayType';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';
import { recursive } from 'merge';
import { atOrThrow } from 'my-easy-fp';

export function getBodyMap<T extends Record<string, unknown>>(
  thisFrame: T,
  fields: (BodyFieldOption | ObjectBodyFieldOption)[],
): Record<string, unknown> | SupportPrimitiveType | SupportArrayType | unknown[] {
  const bodies: unknown[] = [];
  const objectBodies: unknown[] = [];

  const classifed = fields.reduce<{
    bodies: BodyFieldOption[];
    objectBodies: ObjectBodyFieldOption[];
  }>(
    (aggregated, option) => {
      if (option.type === 'body') {
        aggregated.bodies.push(option);
      } else {
        aggregated.objectBodies.push(option);
      }

      return aggregated;
    },
    {
      bodies: [],
      objectBodies: [],
    },
  );

  classifed.objectBodies = classifed.objectBodies.sort((l, r) => l.order - r.order);

  for (const field of classifed.bodies) {
    bodies.push(getBodyField(thisFrame, field));
  }

  for (const field of classifed.objectBodies) {
    objectBodies.push(getObjectBodyField(thisFrame, field));
  }

  // ------------------------------------------------------------------------------------
  // merge.recursive cannot merge primitive arrays, user-defined type arrays, or primitives
  // directly. When objectBody receives any of these three forms, they must be handled
  // separately. Primitives are always processed first.
  // ------------------------------------------------------------------------------------
  // primitive type array
  const primitiveTypes = objectBodies.filter((item): item is SupportArrayType => isValidPrimitiveType(item));

  if (primitiveTypes.length > 0) {
    return atOrThrow(primitiveTypes, 0);
  }

  // ObjectBody supports only one array entry — all arrays are flattened and merged into one.
  // Body, by contrast, separates arrays by field name so multiple arrays can coexist.
  const customArrayTypes = objectBodies.filter((item): item is unknown[] => Array.isArray(item));
  if (customArrayTypes.length > 0) {
    return customArrayTypes.reduce<unknown[]>((merged, item) => [...merged, ...item], []);
  }
  // ------------------------------------------------------------------------------------

  return recursive(...bodies, ...objectBodies) as Record<string, unknown>;
  // return recursive(bodies) as Record<string, unknown>;
}
