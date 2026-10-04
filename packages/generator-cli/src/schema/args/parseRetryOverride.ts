import type { TEndpointRetry } from "#schema/args/TEndpointRetry.js";

export function parseRetryOverride(value: string): TEndpointRetry {
  const parsed = JSON.parse(value) as unknown;
  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Retry override value must be a JSON object.");
  }
  return parsed as TEndpointRetry;
}
