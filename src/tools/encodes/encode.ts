export function encode(enable: boolean | undefined | null, value: string | number): string {
  if (enable != null && enable) {
    return encodeURIComponent(value);
  }

  if (typeof value === 'number') {
    return `${value}`;
  }

  return value;
}
