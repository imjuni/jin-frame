import { z } from "zod";
import { coerceIdentifier } from "#src/validators/coerceIdentifier.js";

export const normalizeGeneratorOptionInput = (value: unknown) => {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;

  return {
    ...record,
    logLevel: record["log-level"] ?? record.logLevel,
    baseFrame: record["base-frame"] ?? record.baseFrame,
    codeFence: record["code-fence"] ?? record.codeFence,
    hostStrategy: record["host-strategy"] ?? record.hostStrategy,
    hostEnvVar: record["host-env-var"] ?? record.hostEnvVar,
    hostFunctionName: record["host-function-name"] ?? record.hostFunctionName,
    serverMapping: record["server-mapping"] ?? record.serverMapping,
  };
};

export const generatorOptionSchema = z.object({
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
  hostStrategy: z.enum(["string", "function", "env-function"]).default("string"),
  hostEnvVar: z.string().min(1).default("NODE_ENV"),
  hostFunctionName: z.string().min(1).default("getApiHost"),
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
});

export type TGeneratorOption = z.infer<typeof generatorOptionSchema>;
