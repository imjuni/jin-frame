import { safeParse } from '#/tools/safeParse';
import { safeYamlParse } from '#/tools/safeYamlParse';

export function multiParse<T = unknown>(value: string): T | undefined {
  const json = safeParse<T>(value);
  if (json != null) {
    return json;
  }

  const yaml = safeYamlParse<T>(value);
  if (yaml != null) {
    return yaml;
  }

  return undefined;
}
