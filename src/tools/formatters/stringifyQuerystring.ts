import { encode } from '#tools/encodes/encode';
import { stringifyExceptString } from '#tools/formatters/stringifyExceptString';

export function stringifyQuerystring(
  values: unknown,
  option?: { comma?: boolean; encode?: boolean },
): string | string[] {
  if (!Array.isArray(values)) {
    return encode(option?.encode, stringifyExceptString(values));
  }

  if (option?.comma != null && option.comma) {
    return values.map((value) => encode(option?.encode, stringifyExceptString(value))).join(',');
  }

  return values.map((value) => encode(option?.encode, stringifyExceptString(value)));
}
