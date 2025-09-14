export function removeEndSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, value.length - 1) : value;
}
