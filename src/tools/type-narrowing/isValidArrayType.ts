import type TSupportArrayType from '#tools/type-utilities/TSupportArrayType';
import { first } from 'my-easy-fp';

export default function isValidArrayType(value: unknown): value is TSupportArrayType {
  if (typeof value === 'object' && Array.isArray(value)) {
    if (
      typeof first(value) === 'string' ||
      typeof first(value) === 'boolean' ||
      typeof first(value) === 'number' ||
      (typeof first(value) === 'object' && first(value) instanceof Date)
    ) {
      return true;
    }

    return false;
  }

  return false;
}
