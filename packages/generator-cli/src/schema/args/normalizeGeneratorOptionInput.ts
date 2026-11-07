import { mergeRecords } from "#schema/args/mergeRecords.js";
import { parseEndpointOverrideMap } from "#schema/args/parseEndpointOverride.js";
import { parseRetryOverride } from "#schema/args/parseRetryOverride.js";
import type { TEndpointRetry } from "#schema/args/TEndpointRetry.js";

export function normalizeGeneratorOptionInput(value: unknown): unknown {
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
    templatePath: record["template-path"] ?? record.templatePath,
    logLevel: record["log-level"] ?? record.logLevel,
    baseFrame: record["base-frame"] ?? record.baseFrame,
    codeFence: record["code-fence"] ?? record.codeFence,
    int64AsString: record["int64-as-string"] ?? record.int64AsString,
    hostStrategy: record["host-strategy"] ?? record.hostStrategy,
    hostEnvVar: record["host-env-var"] ?? record.hostEnvVar,
    hostFunctionName: record["host-function-name"] ?? record.hostFunctionName,
    hostFunctionImport: record["host-function-import"] ?? record.hostFunctionImport,
    serverMapping: record["server-mapping"] ?? record.serverMapping,
    securityProviderDir: record["security-provider-dir"] ?? record.securityProviderDir,
    host: host.rest ?? (host.hasValues ? undefined : record.host),
    hosts: mergeRecords(record.hosts as Record<string, string> | undefined, host.overrides),
    timeout: timeout.rest ?? (timeout.hasValues ? undefined : record.timeout),
    timeouts: mergeRecords(record.timeouts as Record<string, number> | undefined, timeout.overrides),
    retries: mergeRecords(record.retries as Record<string, TEndpointRetry> | undefined, retry.overrides),
  };
}
