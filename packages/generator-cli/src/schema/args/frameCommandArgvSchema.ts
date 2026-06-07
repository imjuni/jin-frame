import { z } from "zod";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";
import { generatorOptionSchema, normalizeGeneratorOptionInput } from "#schema/args/generatorOptionSchema.js";
import {
  normalizeOpenAPITypeScriptOptionInput,
  openapiTypeScriptOptionSchema,
} from "#schema/args/openapiTypeScriptOptionSchema.js";
import { coercePathOrUrl } from "#validators/coercePathOrUrl.js";
import { getCoercePath } from "#validators/getCoercePath.js";

const frameCommandSchema = generatorOptionSchema.extend({
  ...openapiTypeScriptOptionSchema.shape,
  action: z.literal(CE_COMMAND.FRAME).default(CE_COMMAND.FRAME),
  spec: z.string().min(1).transform(coercePathOrUrl),
  type: z
    .string()
    .min(1)
    .transform(getCoercePath({ kind: "file", name: "--type" })),
});

export const frameCommandArgvSchema = z.preprocess(
  (value) => normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value)),
  frameCommandSchema,
);

export type TFrameCommandArgv = z.infer<typeof frameCommandArgvSchema>;
