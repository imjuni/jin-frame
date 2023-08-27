import type { IBodyField } from '#interfaces/body/IBodyField';
import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/body/IObjectBodyFieldOption';
import { processBodyFormatters } from '#processors/processBodyFormatters';
import { processObjectBodyFormatters } from '#processors/processObjectBodyFormatters';
import isValidArrayType from '#tools/type-narrowing/isValidArrayType';
import isValidPrimitiveType from '#tools/type-narrowing/isValidPrimitiveType';
import type TSupportArrayType from '#tools/type-utilities/TSupportArrayType';
import type TSupportPrimitiveType from '#tools/type-utilities/TSupportPrimitiveType';
import * as dotProp from 'dot-prop';
import fastSafeStringify from 'fast-safe-stringify';
import { recursive } from 'merge';
import { atOrThrow } from 'my-easy-fp';

export function getBodyInfo<T extends Record<string, unknown>>(thisFrame: T, fields: IBodyField[], strict?: boolean) {
  const objectBodyFields = fields.filter(
    (field): field is { key: string; option: IObjectBodyFieldOption } => field.option.type === 'object-body',
  );

  const sortedObjectBodyFields = [...objectBodyFields].sort(
    (l, r) => (l.option.order ?? Number.MAX_SAFE_INTEGER) - (r.option.order ?? Number.MAX_SAFE_INTEGER),
  );

  const objectBodyFieldsFormatted = sortedObjectBodyFields
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    .map<any | undefined>((field) => {
      const { key: thisFrameAccessKey, option } = field;
      const value: unknown = dotProp.get<unknown>(thisFrame, thisFrameAccessKey);

      // stage 01. general action - undefined or null type
      if (value == null) {
        return undefined;
      }

      // stage 02. formatters apply
      if ('formatters' in option && option.formatters != null) {
        const formatted = processObjectBodyFormatters(strict ?? false, thisFrame, field, option.formatters);
        return formatted;
      }

      // general action start
      // stage 03. general action - primitive type
      if (isValidPrimitiveType(value)) {
        return value;
      }

      // stage 04. general action - array of primitive type
      if (isValidArrayType(value)) {
        return value;
      }

      // stage 05. general action - object of complexed type
      if (typeof value === 'object') {
        return value;
      }

      if (strict) {
        throw new Error(`unknown type of value: ${typeof value} - ${fastSafeStringify(value)}`);
      }

      // unkonwn type
      return undefined;
    })
    .filter((item): item is TSupportPrimitiveType | TSupportArrayType | object => item != null);

  const primitiveTypeHandler = () => {
    // 기본 자료형
    const primitiveTypes = objectBodyFieldsFormatted.filter((item): item is TSupportArrayType =>
      isValidPrimitiveType(item),
    );
    if (primitiveTypes.length > 0) {
      return atOrThrow(primitiveTypes, 0);
    }

    // ObjectBody에서 배열은 하나만 처리할 수 있다. 그래서 ObjectBody 인데 배열이 있는 경우, 배열을 전부 합쳐서 반환한다
    // 반면 Body는 이름으로 배열을 분리하기 때문에 여러개를 처리할 수 있다
    const customArrayTypes = objectBodyFieldsFormatted.filter((item): item is unknown[] => Array.isArray(item));
    if (customArrayTypes.length > 0) {
      return customArrayTypes.reduce<unknown[]>((merged, item) => [...merged, ...item], []);
    }
    return undefined;
  };

  const primitiveTypeValue = primitiveTypeHandler();

  if (primitiveTypeValue != null) {
    return primitiveTypeValue;
  }

  const objectBodyFieldsProcessed = objectBodyFieldsFormatted.reduce<Record<string, unknown>>(
    (aggregation, item) => ({ ...aggregation, ...(item as object) }),
    {},
  );

  const bodyFields = fields.filter(
    (field): field is { key: string; option: IBodyFieldOption } => field.option.type === 'body',
  );

  const bodyFieldsProcessed = bodyFields
    .map<Record<string, unknown> | undefined>((field) => {
      const { key: thisFrameAccessKey, option } = field;
      const value: unknown = dotProp.get<unknown>(thisFrame, thisFrameAccessKey);

      // stage 01. general action - undefined or null type
      if (value == null) {
        return undefined;
      }

      const resultAccesssKey = option.replaceAt ?? thisFrameAccessKey;

      // stage 02. formatters apply
      if ('formatters' in option && option.formatters != null) {
        const formatted = processBodyFormatters(strict ?? false, thisFrame, field, option.formatters);
        return formatted as Record<string, unknown>;
      }

      // general action start
      // stage 03. general action - primitive type
      if (isValidPrimitiveType(value)) {
        return dotProp.set<Record<string, unknown>>({}, resultAccesssKey, value);
      }

      // stage 04. general action - array of primitive type
      if (isValidArrayType(value)) {
        return dotProp.set<Record<string, unknown>>({}, resultAccesssKey, value);
      }

      // stage 05. general action - object of complexed type
      if (typeof value === 'object') {
        return dotProp.set<Record<string, unknown>>({}, resultAccesssKey, value);
      }

      if (strict) {
        throw new Error(`unknown type of value: ${resultAccesssKey} - ${typeof value} - ${fastSafeStringify(value)}`);
      }

      // unkonwn type
      return undefined;
    })
    .filter((item): item is Record<string, TSupportPrimitiveType | TSupportArrayType | object> => item != null)
    .reduce<Record<string, TSupportPrimitiveType | TSupportArrayType | object>>(
      (aggregation, item) => ({ ...aggregation, ...item }),
      {},
    );

  return recursive(objectBodyFieldsProcessed, bodyFieldsProcessed) as Record<string, unknown>;
}
