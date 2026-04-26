import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { SupportArrayType } from '#tools/type-utilities/SupportArrayType';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';

export function typeAssert(strict: boolean, value: unknown): value is SupportArrayType | SupportPrimitiveType {
  if (isValidPrimitiveWithDateType(value)) {
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
