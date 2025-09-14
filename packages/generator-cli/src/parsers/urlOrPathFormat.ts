export function urlOrPathFormat(value: string | URL): string {
  return value instanceof URL ? value.toString() : value;
}
