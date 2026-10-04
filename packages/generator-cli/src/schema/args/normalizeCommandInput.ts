import { compactUndefined } from "#schema/args/compactUndefined.js";
import { normalizeGeneratorOptionInput } from "#schema/args/normalizeGeneratorOptionInput.js";
import { normalizeOpenAPITypeScriptOptionInput } from "#schema/args/normalizeOpenAPITypeScriptOptionInput.js";
import type { TCommandInput } from "#schema/args/TCommandInput.js";

export function normalizeCommandInput(value: unknown): TCommandInput {
  const normalized = normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value));
  if (normalized == null || typeof normalized !== "object" || Array.isArray(normalized)) return {};
  return compactUndefined(normalized as TCommandInput);
}
