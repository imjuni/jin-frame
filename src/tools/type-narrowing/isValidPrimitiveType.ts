import type TSupportPrimitiveType from '#tools/type-utilities/TSupportPrimitiveType';

export default function isValidPrimitiveType(value: unknown): value is TSupportPrimitiveType {
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
