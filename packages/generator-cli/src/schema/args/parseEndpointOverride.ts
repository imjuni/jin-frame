import type { TEndpointRetry } from "#src/schema/args/generatorConfigSchema.js";

type TEndpointOverrideParser<T> = (value: string) => T;

function toValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

function splitEndpointOverride(value: string): [string, string] | undefined {
  const index = value.indexOf("=");

  if (index < 0) {
    return undefined;
  }

  const key = value.slice(0, index).trim();
  const raw = value.slice(index + 1).trim();

  if (!key.startsWith("/") || raw.length === 0) {
    return undefined;
  }

  return [key, raw];
}

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

export function parseRetryOverride(value: string): TEndpointRetry {
  const parsed = JSON.parse(value) as unknown;

  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Retry override value must be a JSON object.");
  }

  return parsed as TEndpointRetry;
}
