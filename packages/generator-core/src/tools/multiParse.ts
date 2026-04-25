import type { IMultiParse } from '#/tools/interfaces/IMultiParse';
import { safeParse } from '#/tools/safeParse';
import { safeYamlParse } from '#/tools/safeYamlParse';

export function multiParse<T = unknown>(value: string): IMultiParse<T> | undefined {
  const json = safeParse<T>(value);
  if (json != null) {
    return { kind: 'json', data: json };
  }

  const yaml = safeYamlParse<T>(value);
  if (yaml != null) {
    return { kind: 'yaml', data: yaml };
  }

  return undefined;
}
