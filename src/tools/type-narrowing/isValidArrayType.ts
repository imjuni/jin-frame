import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';

export function isValidArrayType(values: unknown): values is TSupportArrayType {
  if (Array.isArray(values)) {
    return values.every((value) => isValidPrimitiveWithDateType(value));
  }

  return false;
}
