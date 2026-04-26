import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';

export function isValidPrimitiveWithDateType(value: unknown): value is SupportPrimitiveType {
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
