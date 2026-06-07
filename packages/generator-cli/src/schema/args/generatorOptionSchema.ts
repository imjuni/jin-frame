import { z } from "zod";
import { endpointOverridesSchema, type TEndpointRetry } from "#src/schema/args/generatorConfigSchema.js";
import { parseEndpointOverrideMap, parseRetryOverride } from "#src/schema/args/parseEndpointOverride.js";
import { coerceIdentifier } from "#src/validators/coerceIdentifier.js";

function mergeRecords<T>(left?: Record<string, T>, right?: Record<string, T>): Record<string, T> | undefined {
  const merged = { ...(left ?? {}), ...(right ?? {}) };
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export const normalizeGeneratorOptionInput = (value: unknown) => {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const host = parseEndpointOverrideMap(record.host, (entry) => entry);
  const timeout = parseEndpointOverrideMap(record.timeout, (entry) => Number(entry));
  const retry = parseEndpointOverrideMap(record.retry, parseRetryOverride);

  return {
    ...record,
    config: record.config,
    logLevel: record["log-level"] ?? record.logLevel,
    baseFrame: record["base-frame"] ?? record.baseFrame,
    codeFence: record["code-fence"] ?? record.codeFence,
    hostStrategy: record["host-strategy"] ?? record.hostStrategy,
    hostEnvVar: record["host-env-var"] ?? record.hostEnvVar,
    hostFunctionName: record["host-function-name"] ?? record.hostFunctionName,
    serverMapping: record["server-mapping"] ?? record.serverMapping,
    host: host.rest ?? (host.hasValues ? undefined : record.host),
    hosts: mergeRecords(record.hosts as Record<string, string> | undefined, host.overrides),
    timeout: timeout.rest ?? (timeout.hasValues ? undefined : record.timeout),
    timeouts: mergeRecords(record.timeouts as Record<string, number> | undefined, timeout.overrides),
    retries: mergeRecords(record.retries as Record<string, TEndpointRetry> | undefined, retry.overrides),
  };
};

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
  ...endpointOverridesSchema.shape,
});

export type TGeneratorOption = z.infer<typeof generatorOptionSchema>;
