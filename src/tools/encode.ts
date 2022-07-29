export default function encode(enable: boolean | undefined | null, value: string | number) {
  if (enable !== undefined && enable !== null && enable) {
    return encodeURIComponent(value);
  }

  return value;
}
