import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';

export function isValidPrimitiveType(value: unknown): value is Exclude<TSupportPrimitiveType, Date> {
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
    return true;
  }

  return false;
}
