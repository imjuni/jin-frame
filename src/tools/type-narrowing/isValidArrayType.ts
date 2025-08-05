import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';

export function isValidArrayType(values: unknown): values is TSupportArrayType {
  if (Array.isArray(values)) {
    return values.every((value) => isValidPrimitiveType(value));
  }

  return false;
}
