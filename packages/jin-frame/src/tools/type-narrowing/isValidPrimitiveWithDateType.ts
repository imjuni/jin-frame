import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';

export function isValidPrimitiveWithDateType(value: unknown): value is TSupportPrimitiveType {
  if (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    (typeof value === 'object' && value instanceof Date)
  ) {
    return true;
  }

  return false;
}
