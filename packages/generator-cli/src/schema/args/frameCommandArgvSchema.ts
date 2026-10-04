import { z } from "zod";
import { frameCommandSchema } from "#schema/args/frameCommandSchema.js";
import { normalizeGeneratorOptionInput } from "#schema/args/normalizeGeneratorOptionInput.js";
import { normalizeOpenAPITypeScriptOptionInput } from "#schema/args/normalizeOpenAPITypeScriptOptionInput.js";

export const frameCommandArgvSchema = z.preprocess(
  (value) => normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value)),
  frameCommandSchema,
);
