import { first } from 'my-easy-fp';

export function isValidPrimitiveType(value: unknown): value is string | boolean | number | Date {
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

export function isValidArrayType(value: unknown): value is string[] | boolean[] | number[] | Date[] {
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

export function typeAssert(strict: boolean, value: unknown): boolean {
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
