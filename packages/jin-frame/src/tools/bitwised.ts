export function bitwised(values: number[]): number {
  return values.reduce((bitwise, value) => bitwise | value, 0); // eslint-disable-line no-bitwise
}
