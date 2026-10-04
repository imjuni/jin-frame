import { z } from "zod";
import { createCommandSchema } from "#schema/args/createCommandSchema.js";
import { normalizeGeneratorOptionInput } from "#schema/args/generatorOptionSchema.js";
import { normalizeOpenAPITypeScriptOptionInput } from "#schema/args/openapiTypeScriptOptionSchema.js";

export const createCommandArgvSchema = z.preprocess(
  (value) => normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value)),
  createCommandSchema,
);
