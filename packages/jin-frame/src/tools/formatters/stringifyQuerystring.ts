import { encode } from "#tools/encodes/encode";
import { stringifyExceptString } from "#tools/formatters/stringifyExceptString";

export function stringifyQuerystring(
  values: unknown,
  option?: { comma?: boolean; encode?: boolean; separator?: "," | " " | "|" },
): string | string[] {
  if (!Array.isArray(values)) {
    return encode(option?.encode, stringifyExceptString(values));
  }

  const separator = option?.separator ?? (option?.comma === true ? "," : undefined);
  if (separator != null) {
    return values.map((value) => encode(option?.encode, stringifyExceptString(value))).join(separator);
  }

  return values.map((value) => encode(option?.encode, stringifyExceptString(value)));
}
