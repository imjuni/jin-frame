import { IBodyField } from '@interfaces/body/IBodyField';
import { processBodyFormatters } from '@processors/processBodyFormatters';
import { isValidArrayType, isValidPrimitiveType } from '@tools/typeAssert';
import { set } from 'dot-prop';
import { recursive } from 'merge';
import { isError } from 'my-easy-fp';

export function getBodyInfo<T extends Record<string, any>>(thisFrame: T, fields: IBodyField[], strict?: boolean) {
  return fields
    .map<Record<string, any> | undefined>((field) => {
      try {
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
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised body');
        throw err;
      }
    })
    .filter((processed): processed is Record<string, any> => processed !== undefined && processed !== null)
    .reduce<Record<string, any>>((aggregation, processing) => recursive(aggregation, processing), {});
}
