import { z } from "zod";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import { generatorOptionSchema, normalizeGeneratorOptionInput } from "#src/schema/args/generatorOptionSchema.js";
import {
  normalizeOpenAPITypeScriptOptionInput,
  openapiTypeScriptOptionSchema,
} from "#src/schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#src/validators/coercePathOrUrl.js";

const createCommandSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.CREATE).default(CE_COMMAND.CREATE),
  spec: z.string().min(1).transform(coercePathOrUrl),
});

export const createCommandArgvSchema = z.preprocess(
  (value) => normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value)),
  createCommandSchema,
);

export type TCreateCommandArgv = z.infer<typeof createCommandArgvSchema>;
