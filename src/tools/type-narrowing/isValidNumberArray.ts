export function isValidNumberArray(value: unknown): value is number[] {
  if (Array.isArray(value)) {
    return value.every((item: unknown) => typeof item === 'number');
  }

  return false;
}
