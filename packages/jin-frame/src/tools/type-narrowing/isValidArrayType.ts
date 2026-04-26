import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { SupportArrayType } from '#tools/type-utilities/SupportArrayType';

export function isValidArrayType(values: unknown): values is SupportArrayType {
  if (Array.isArray(values)) {
    return values.every((value) => isValidPrimitiveWithDateType(value));
  }

  return false;
}
