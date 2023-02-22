import type { IBodyField } from '@interfaces/body/IBodyField';
import type { IBodyFieldOption } from '@interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '@interfaces/body/IObjectBodyFieldOption';
import { processBodyFormatters } from '@processors/processBodyFormatters';
import { processObjectBodyFormatters } from '@processors/processObjectBodyFormatters';
import { isValidArrayType, isValidPrimitiveType } from '@tools/typeAssert';
import { set } from 'dot-prop';
import { recursive } from 'merge';
import { first } from 'my-easy-fp';

export function getBodyInfo<T extends Record<string, any>>(thisFrame: T, fields: IBodyField[], strict?: boolean) {
  const objectBodyFields = fields.filter(
    (field): field is { key: string; option: IObjectBodyFieldOption } => field.option.type === 'object-body',
  );

  const sortedObjectBodyFields = [...objectBodyFields].sort(
    (l, r) => (l.option.order ?? Number.MAX_SAFE_INTEGER) - (r.option.order ?? Number.MAX_SAFE_INTEGER),
  );

  const objectBodyFieldsFormatted = sortedObjectBodyFields
    .map<Record<string, any> | undefined>((field) => {
      const { key: thisFrameAccessKey, option } = field;
      const value: any = thisFrame[thisFrameAccessKey];

      // stage 01. general action - undefined or null type
      if (value == null) {
        return undefined;
      }

      // stage 02. formatters apply
      if ('formatters' in option && option.formatters != null) {
        return processObjectBodyFormatters(strict ?? false, thisFrame, field, option.formatters);
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
        throw new Error(`unknown type of value: ${typeof value} - ${value}`);
      }

      // unkonwn type
      return undefined;
    })
    .filter((processed): processed is Record<string, any> => processed !== undefined && processed !== null);

  if (
    objectBodyFieldsFormatted.length > 0 &&
    objectBodyFieldsFormatted.every((element) => isValidPrimitiveType(element))
  ) {
    return first(objectBodyFieldsFormatted);
  }

  if (objectBodyFieldsFormatted.length > 0 && objectBodyFieldsFormatted.some((element) => Array.isArray(element))) {
    const objectBodyArrayFields: any[] = objectBodyFieldsFormatted.filter((element) => Array.isArray(element));
    return objectBodyArrayFields.reduce<any[]>((aggregation, objectBodyArrayField) => {
      return [...aggregation, ...objectBodyArrayField];
    }, []);
  }

  const objectBodyFieldsProcessed = objectBodyFieldsFormatted.reduce<Record<string, any>>(
    (aggregation, processing) => recursive(aggregation, processing),
    {},
  );

  const bodyFields = fields.filter(
    (field): field is { key: string; option: IBodyFieldOption } => field.option.type === 'body',
  );

  const bodyFieldsProcessed = bodyFields
    .map<Record<string, any> | undefined>((field) => {
      const { key: thisFrameAccessKey, option } = field;
      const value: any = thisFrame[thisFrameAccessKey];

      // stage 01. general action - undefined or null type
      if (value === undefined || value === null) {
        return undefined;
      }

      // stage 02. formatters apply
      if ('formatters' in option && option.formatters !== undefined && option.formatters !== null) {
        return processBodyFormatters(strict ?? false, thisFrame, field, option.formatters);
      }

      const resultAccesssKey = option.replaceAt ?? thisFrameAccessKey;

      // general action start
      // stage 03. general action - primitive type
      if (isValidPrimitiveType(value)) {
        return set({}, resultAccesssKey, value);
      }

      // stage 04. general action - array of primitive type
      if (isValidArrayType(value)) {
        return set({}, resultAccesssKey, value);
      }

      // stage 05. general action - object of complexed type
      if (typeof value === 'object') {
        return set({}, resultAccesssKey, value);
      }

      if (strict) {
        throw new Error(`unknown type of value: ${resultAccesssKey} - ${typeof value} - ${value}`);
      }

      // unkonwn type
      return undefined;
    })
    .filter((processed): processed is Record<string, any> => processed !== undefined && processed !== null)
    .reduce<Record<string, any>>((aggregation, processing) => recursive(aggregation, processing), {});

  return recursive(objectBodyFieldsProcessed, bodyFieldsProcessed);
}
