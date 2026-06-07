import { z } from "zod";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import { generatorOptionSchema } from "#src/schema/args/generatorOptionSchema.js";
import { openapiTypeScriptOptionSchema } from "#src/schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#src/validators/coercePathOrUrl.js";

export const createCommandArgvSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.CREATE).default(CE_COMMAND.CREATE),
  spec: z.string().min(1).transform(coercePathOrUrl),
});

export type TCreateCommandArgv = z.infer<typeof createCommandArgvSchema>;
