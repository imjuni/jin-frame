export function safeParse<T = unknown>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    // Return raw string for plain-text responses (e.g. API returns "hello" without JSON encoding)
    return value as unknown as T;
  }
}
