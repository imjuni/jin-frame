import { parse } from 'yaml';

export function safeYamlParse<T = unknown>(value: string): T | undefined {
  try {
    return parse(value) as T;
  } catch {
    return undefined;
  }
}
