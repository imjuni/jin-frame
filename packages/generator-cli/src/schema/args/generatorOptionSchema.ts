import { isIdentifierName } from "@babel/helper-validator-identifier";
import { z } from "zod";
import { endpointOverridesSchema } from "#schema/args/endpointOverridesSchema.js";
import { securityProviderSchema } from "#schema/args/securityProviderSchema.js";
import { coerceIdentifier } from "#validators/coerceIdentifier.js";

export const generatorOptionSchema = z.object({
  config: z.string().min(1).optional(),
  spec: z.string().min(1),
  output: z.string().min(1),
  logLevel: z.enum(["info", "debug", "error"]).default("info"),
  host: z.string().min(1).optional(),
  baseFrame: z
    .union([z.string().min(1), z.literal(false)])
    .default("ServerHostFrame")
    .transform((value) => coerceIdentifier(value)),
  timeout: z.coerce.number().default(60_000),
  codeFence: z.boolean().default(true),
  int64AsString: z.boolean().default(false),
  hostStrategy: z.enum(["string", "function", "env-function"]).default("string"),
  hostEnvVar: z.string().min(1).default("NODE_ENV"),
  hostFunctionName: z
    .string()
    .min(1)
    .refine((value) => isIdentifierName(value), "Host function name must be a valid TypeScript identifier")
    .default("getApiHost"),
  hostFunctionImport: z.string().min(1).optional(),
  serverMapping: z
    .preprocess((value) => {
      if (typeof value !== "string") {
        return value;
      }

      if (value.length === 0) {
        return undefined;
      }

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }, z.record(z.string(), z.string()).optional())
    .optional(),
  ...endpointOverridesSchema.shape,
  ...securityProviderSchema.shape,
});
