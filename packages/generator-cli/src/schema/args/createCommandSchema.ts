import { z } from "zod";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";
import { generatorOptionSchema } from "#schema/args/generatorOptionSchema.js";
import { openapiTypeScriptOptionSchema } from "#schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#validators/coercePathOrUrl.js";

export const createCommandSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.CREATE).default(CE_COMMAND.CREATE),
  spec: z.string().min(1).transform(coercePathOrUrl),
});
