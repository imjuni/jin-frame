import type { IFormatter } from '#interfaces/IFormatter';
import type { IHeaderField } from '#interfaces/IHeaderField';
import encodes from '#tools/encodes/encodes';
import applyFormatters from '#tools/formatters/applyFormatters';
import isValidArrayType from '#tools/type-narrowing/isValidArrayType';
import isValidPrimitiveType from '#tools/type-narrowing/isValidPrimitiveType';
import fastSafeStringify from 'fast-safe-stringify';

export function processHeaderFormatters<T extends Record<string, unknown>>(
  thisFrame: T,
  field: IHeaderField,
  formatters: IFormatter[],
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: unknown = thisFrame[thisFrameAccessKey];

  if (!isValidPrimitiveType(value) && !isValidArrayType(value)) {
    return undefined;
  }

  const processed = formatters
    .map<Record<string, unknown>>((formatter) => {
      const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;

      // stage 01. apply formatter
      const formatted: string | string[] = applyFormatters(value, formatter);

      // stage 02. array processing
      if (Array.isArray(formatted)) {
        // comma seperated string or json serialization
        const commaApplied = (option.comma ?? false) === true ? formatted.join(',') : fastSafeStringify(formatted);
        const encoded = encodes(option.encode, commaApplied);
        return { [resultAccessKey]: encoded };
      }

      // stage 03. general action
      const encoded = encodes(option.encode, formatted);

      return { [resultAccessKey]: encoded };
    })
    .reduce((merged, formatted) => ({ ...merged, ...formatted }), {});

  return processed;
}
