import { z } from "zod";
import { createCommandSchema } from "#schema/args/createCommandSchema.js";
import { normalizeGeneratorOptionInput } from "#schema/args/normalizeGeneratorOptionInput.js";
import { normalizeOpenAPITypeScriptOptionInput } from "#schema/args/normalizeOpenAPITypeScriptOptionInput.js";

export const createCommandArgvSchema = z.preprocess(
  (value) => normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value)),
  createCommandSchema,
);
