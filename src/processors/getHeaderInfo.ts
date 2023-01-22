import type { IHeaderField } from '@interfaces/IHeaderField';
import { processHeaderFormatters } from '@processors/processHeaderFormatters';
import { encodes } from '@tools/encode';
import { isValidArrayType, isValidPrimitiveType } from '@tools/typeAssert';
import fastSafeStringify from 'fast-safe-stringify';

export function getHeaderInfo<T extends Record<string, any>>(thisFrame: T, fields: IHeaderField[], strict?: boolean) {
  return fields
    .map<Record<string, any> | undefined>((field) => {
      const { key: thisFrameAccessKey, option } = field;
      const value: any = thisFrame[thisFrameAccessKey];

      try {
        // stage 01. general action - undefined or null type
        if (value == null) {
          return undefined;
        }

        // stage 02. formatters apply
        if ('formatters' in option && option.formatters !== undefined && option.formatters !== null) {
          const formatters = Array.isArray(option.formatters) ? option.formatters : [option.formatters];
          return processHeaderFormatters(thisFrame, field, formatters);
        }

        const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;

        // general action start
        // stage 03. general action - primitive type
        // header not support dot-props set action
        if (isValidPrimitiveType(value)) {
          return { [resultAccessKey]: value };
        }

        // stage 04. general action - array of primitive type
        // header not support dot-props set action
        if (isValidArrayType(value)) {
          // stage 04-1. array processing - comma seperated string
          if ((option.comma ?? false) === true) {
            const encoded = encodes(option.encode, value.join(','));
            return { [resultAccessKey]: encoded };
          }

          // stage 04-2. array processing - json serialization
          const encoded = encodes(option.encode, fastSafeStringify(value));
          return { [resultAccessKey]: encoded };
        }

        // stage 05. general action - object of complexed type
        // header not support dot-props set action
        if (typeof value === 'object') {
          return { [resultAccessKey]: encodes(option.encode, fastSafeStringify(value)) };
        }

        if (strict) {
          throw new Error(`unknown type of value: ${resultAccessKey} - ${typeof value} - ${value}`);
        }

        // unkonwn type
        return undefined;
      } catch {
        return value;
      }
    })
    .filter((processed): processed is Record<string, any> => processed !== undefined && process !== null)
    .reduce<Record<string, any>>((aggregation, formatted) => ({ ...aggregation, ...formatted }), {});
}
