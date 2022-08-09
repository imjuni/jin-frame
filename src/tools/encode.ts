export function encode(enable: boolean | undefined | null, value: string | number) {
  if (enable !== undefined && enable !== null && enable) {
    return encodeURIComponent(value);
  }

  return value;
}

export function encodes(enable: boolean | undefined | null, values: string | number): string;
export function encodes(enable: boolean | undefined | null, values: string[] | number[]): string[];
export function encodes(enable: boolean | undefined | null, values: string | number | string[] | number[]) {
  if (Array.isArray(values)) {
    return values.map((val) => encode(enable, val));
  }

  return encode(enable, values);
}
