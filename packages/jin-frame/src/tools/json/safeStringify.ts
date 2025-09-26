export function safeStringify<T>(
  value: T,
  replacer?: (this: T, key: string, value: T) => T,
  space?: string | number,
): string | undefined {
  try {
    const parsed = JSON.stringify(value, replacer, space);
    return parsed;
  } catch {
    return undefined;
  }
}
