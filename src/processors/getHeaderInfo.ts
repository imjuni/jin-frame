import { IFormatter } from '@interfaces/IFormatter';
import { IHeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import { applyFormatters } from '@tools/applyFormatters';
import { encodes } from '@tools/encode';
import { isValidArrayType, isValidPrimitiveType } from '@tools/typeAssert';
import fastSafeStringify from 'fast-safe-stringify';
import { isError, isFalse, isTrue } from 'my-easy-fp';

interface IHeaderField {
  key: string;
  option: IHeaderFieldOption;
}

function processHeaderFormatters<T extends Record<string, any>>(
  thisFrame: T,
  field: IHeaderField,
  formatters: IFormatter[],
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: any = thisFrame[thisFrameAccessKey];

  const processed = formatters
    .map<Record<string, any>>((formatter) => {
      const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;

      // stage 01. apply formatter
      const formatted: string | string[] = applyFormatters(value, formatter);

      // stage 02-1. array processing - comma seperated string
      if (Array.isArray(formatted) && isTrue(option.comma ?? false)) {
        const encoded = encodes(option.encode, formatted.join(','));
        return { [resultAccessKey]: encoded };
      }

      // stage 02-2. array processing - json serialization
      if (Array.isArray(formatted) && isFalse(option.comma ?? false)) {
        const encoded = encodes(option.encode, fastSafeStringify(formatted));
        return { [resultAccessKey]: encoded };
      }

      // stage 03. general action
      const encoded = encodes(option.encode, formatted);

      return { [resultAccessKey]: encoded };
    })
    .reduce((merged, formatted) => ({ ...merged, ...formatted }), {});

  return processed;
}

export function getHeaderInfo<T extends Record<string, any>>(thisFrame: T, fields: IHeaderField[], strict?: boolean) {
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
          if (isTrue(option.comma ?? false)) {
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
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised body');
        throw err;
      }
    })
    .filter((processed): processed is Record<string, any> => processed !== undefined && process !== null)
    .reduce<Record<string, any>>((aggregation, formatted) => ({ ...aggregation, ...formatted }), {});
}
