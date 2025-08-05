import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';

export function typeAssert(strict: boolean, value: unknown): value is TSupportArrayType | TSupportPrimitiveType {
  if (isValidPrimitiveType(value)) {
    return true;
  }

  if (isValidArrayType(value)) {
    return true;
  }

  if (strict) {
    throw new Error(`invalid type value: ${typeof value}`);
  }

  return false;
}
