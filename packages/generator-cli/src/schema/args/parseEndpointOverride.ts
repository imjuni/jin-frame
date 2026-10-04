import { splitEndpointOverride } from "#schema/args/splitEndpointOverride.js";
import type { TEndpointOverrideParser } from "#schema/args/TEndpointOverrideParser.js";
import { toValues } from "#schema/args/toValues.js";

export function parseEndpointOverrideMap<T>(
  value: unknown,
  parseValue: TEndpointOverrideParser<T>,
): { hasValues: boolean; rest?: string; overrides?: Record<string, T> } {
  const values = toValues(value);
  const overrides: Record<string, T> = {};
  let rest: string | undefined;

  for (const entry of values) {
    const pair = splitEndpointOverride(entry);

    if (pair == null) {
      rest = entry;
      continue;
    }

    const [key, raw] = pair;
    overrides[key] = parseValue(raw);
  }

  return {
    hasValues: values.length > 0,
    rest,
    overrides: Object.keys(overrides).length > 0 ? overrides : undefined,
  };
}
