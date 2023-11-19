import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';
import { first } from 'my-easy-fp';

export function typeAssert(strict: boolean, value: unknown): value is TSupportArrayType | TSupportPrimitiveType {
  if (isValidPrimitiveType(value)) {
    return true;
  }

  if (typeof value === 'object' && Array.isArray(value)) {
    if (
      typeof first(value) === 'string' ||
      typeof first(value) === 'boolean' ||
      typeof first(value) === 'number' ||
      (typeof first(value) === 'object' && first(value) instanceof Date)
    ) {
      return true;
    }
  }

  if (strict) {
    throw new Error(`invalid type value: ${typeof value}`);
  }

  return false;
}
