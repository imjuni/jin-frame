import * as dotProp from 'dot-prop';

export function setToBody(initialValue: unknown, formatted: unknown, findFrom?: string): unknown {
  if (Array.isArray(initialValue) || initialValue == null) {
    return initialValue;
  }

  if (findFrom == null && formatted != null) {
    return formatted;
  }

  if (findFrom == null) {
    return initialValue;
  }

  if (typeof initialValue !== 'object') {
    return initialValue;
  }

  const next = { ...initialValue };

  dotProp.set(next, findFrom, formatted);

  return next;
}
