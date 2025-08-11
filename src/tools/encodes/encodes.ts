import { encode } from '#tools/encodes/encode';

export function encodes(enable: boolean | undefined | null, values: string | number): string;
export function encodes(enable: boolean | undefined | null, values: string[] | number[]): string[];
export function encodes(
  enable: boolean | undefined | null,
  values: string | number | string[] | number[],
): string | string[] {
  if (Array.isArray(values)) {
    return values.map((val) => encode(enable, val));
  }

  return encode(enable, values);
}
