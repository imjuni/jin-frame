import { z } from "zod";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import { generatorOptionSchema } from "#src/schema/args/generatorOptionSchema.js";
import { openapiTypeScriptOptionSchema } from "#src/schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#src/validators/coercePathOrUrl.js";
import { getCoercePath } from "#src/validators/getCoercePath.js";

export const frameCommandArgvSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.FRAME).default(CE_COMMAND.FRAME),
  spec: z.string().min(1).transform(coercePathOrUrl),
  type: z
    .string()
    .min(1)
    .transform(getCoercePath({ kind: "file", name: "--type" })),
});

export type TFrameCommandArgv = z.infer<typeof frameCommandArgvSchema>;
