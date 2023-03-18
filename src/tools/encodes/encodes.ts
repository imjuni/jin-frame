import encode from '#tools/encodes/encode';

function encodes(enable: boolean | undefined | null, values: string | number): string;
function encodes(enable: boolean | undefined | null, values: string[] | number[]): string[];
function encodes(enable: boolean | undefined | null, values: string | number | string[] | number[]) {
  if (Array.isArray(values)) {
    return values.map((val) => encode(enable, val));
  }

  return encode(enable, values);
}

export default encodes;
