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
      typeof value.at(0) === 'string' ||
      typeof value.at(0) === 'boolean' ||
      typeof value.at(0) === 'number' ||
      (typeof value.at(0) === 'object' && value.at(0) instanceof Date)
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
      typeof value.at(0) === 'string' ||
      typeof value.at(0) === 'boolean' ||
      typeof value.at(0) === 'number' ||
      (typeof value.at(0) === 'object' && value.at(0) instanceof Date)
    ) {
      return true;
    }
  }

  if (strict) {
    throw new Error(`invalid type value: ${typeof value}`);
  }

  return false;
}
