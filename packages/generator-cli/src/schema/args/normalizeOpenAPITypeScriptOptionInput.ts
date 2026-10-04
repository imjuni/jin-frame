import { openapiTypeScriptOptionEntries } from "#schema/args/openapiTypeScriptOptionEntries.js";

export function normalizeOpenAPITypeScriptOptionInput(value: unknown): unknown {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return value;
  const record = value as Record<string, unknown>;
  const normalized = { ...record };
  for (const [kebabKey, camelKey] of openapiTypeScriptOptionEntries)
    normalized[camelKey] = record[kebabKey] ?? record[camelKey];
  return normalized;
}
