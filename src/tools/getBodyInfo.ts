import { IBodyField } from '@interfaces/IBodyField';
import { set } from 'dot-prop';
import { recursive } from 'merge';
import { isError } from 'my-easy-fp';
import { processBodyFormatters } from './processBodyFormatters';
import { isValidArrayType, isValidPrimitiveType } from './typeAssert';

export function getBodyInfo<T extends Record<string, any>>(thisFrame: T, fields: IBodyField[], strict?: boolean) {
  return fields
    .map<Record<string, any>>((field) => {
      try {
        const { key: thisFrameAccessKey, option } = field;
        const value: any = thisFrame[thisFrameAccessKey];

        // stage 01. formatters apply
        if ('formatters' in option && option.formatters !== undefined && option.formatters !== null) {
          return processBodyFormatters(strict ?? false, thisFrame, field, option.formatters);
        }

        // stage 02. general action
        const resultAccesssKey = option.replaceAt ?? thisFrameAccessKey;

        // stage 02-0. general action - undefined or null type
        if (value === undefined || value === null) {
          return undefined;
        }

        // stage 02-1. general action - primitive type
        if (isValidPrimitiveType(value)) {
          return set({}, resultAccesssKey, value);
        }

        // stage 02-2. general action - array of primitive type
        if (isValidArrayType(value)) {
          return set({}, resultAccesssKey, value);
        }

        // stage 02-3. general action - object of complexed type
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
    .reduce((aggregation, processing) => recursive(aggregation, processing));
}
