import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';

export function isValidPrimitiveType(value: unknown): value is Exclude<SupportPrimitiveType, Date> {
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
    return true;
  }

  return false;
}
