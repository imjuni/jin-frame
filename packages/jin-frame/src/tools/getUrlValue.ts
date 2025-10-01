export function getUrlValue(value?: string | (() => string | undefined)): string | undefined {
  if (typeof value === 'function') {
    return value();
  }

  return value;
}
