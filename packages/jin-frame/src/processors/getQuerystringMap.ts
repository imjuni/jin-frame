import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import { bitwised } from '#tools/bitwised';
import { encode } from '#tools/encodes/encode';
import { formatEach } from '#tools/formatters/formatEach';
import { stringifyExceptString } from '#tools/formatters/stringifyExceptString';
import { stringifyQuerystring } from '#tools/formatters/stringifyQuerystring';
import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidNumberArray } from '#tools/type-narrowing/isValidNumberArray';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import * as dotProp from 'dot-prop';

export function getQuerystringMap<T extends Record<string, unknown>>(
  thisFrame: T,
  fields: { key: string; option: IQueryFieldOption | IParamFieldOption | IHeaderFieldOption }[],
): Record<string, string | string[]> {
  const queries: Record<string, string | string[]> = {};

  for (const field of fields) {
    const { key: thisFrameAccessKey, option } = field;
    const value: unknown = dotProp.get<unknown>(thisFrame, thisFrameAccessKey);
    const fieldKey = option.replaceAt ?? thisFrameAccessKey;
    const { formatters } = option;

    if (!isValidPrimitiveWithDateType(value) && !isValidArrayType(value)) {
      // stage 01. complex type and object type
      queries[fieldKey] = encode(option.encode, stringifyExceptString(value));
    } else if (option.bit.enable && Array.isArray(value) && isValidNumberArray(value)) {
      // stage 02. bit-wised operator processing
      const bitwisedValue = bitwised(value);

      if (option.bit.withZero || bitwisedValue !== 0) {
        queries[fieldKey] = encode(option.encode, bitwisedValue);
      }
    } else if (formatters != null) {
      // stage 03. apply formatter
      const formatteds = formatEach(value, formatters);
      const stringified = stringifyQuerystring(formatteds, option);
      queries[fieldKey] = stringified;
    } else {
      // stage 04. comma seperation processing
      const stringified = stringifyQuerystring(value, option);
      queries[fieldKey] = stringified;
    }
  }

  return queries;
}
