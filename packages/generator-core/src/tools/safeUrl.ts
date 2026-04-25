export function safeUrl(value?: unknown): URL | undefined {
  try {
    if (value == null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      return undefined;
    }

    return new URL(value);
  } catch {
    return undefined;
  }
}
