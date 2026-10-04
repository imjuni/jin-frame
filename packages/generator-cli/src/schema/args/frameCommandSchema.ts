import { z } from "zod";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";
import { generatorOptionSchema } from "#schema/args/generatorOptionSchema.js";
import { openapiTypeScriptOptionSchema } from "#schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#validators/coercePathOrUrl.js";
import { getCoercePath } from "#validators/getCoercePath.js";

export const frameCommandSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.FRAME).default(CE_COMMAND.FRAME),
  spec: z.string().min(1).transform(coercePathOrUrl),
  type: z
    .string()
    .min(1)
    .transform(getCoercePath({ kind: "file", name: "--type" })),
});
