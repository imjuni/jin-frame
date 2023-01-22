import type { IFormatter } from '@interfaces/IFormatter';
import type { IHeaderField } from '@interfaces/IHeaderField';
import { applyFormatters } from '@tools/applyFormatters';
import { encodes } from '@tools/encode';
import fastSafeStringify from 'fast-safe-stringify';

export function processHeaderFormatters<T extends Record<string, any>>(
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
