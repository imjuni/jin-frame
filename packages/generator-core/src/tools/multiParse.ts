import type { IMultiParse } from "#/tools/interfaces/IMultiParse.js";
import { safeParse } from "#/tools/safeParse.js";
import { safeYamlParse } from "#/tools/safeYamlParse.js";

export function multiParse<T = unknown>(value: string): IMultiParse<T> | undefined {
  const json = safeParse<T>(value);
  if (json != null) {
    return { kind: "json", data: json };
  }

  const yaml = safeYamlParse<T>(value);
  if (yaml != null) {
    return { kind: "yaml", data: yaml };
  }

  return undefined;
}
