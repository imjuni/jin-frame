import * as dotProp from 'dot-prop';

export function findFromBody(initialValue: unknown, findFrom?: string): unknown {
  return typeof initialValue === 'object' && !Array.isArray(initialValue) && initialValue != null && findFrom != null
    ? dotProp.get(initialValue, findFrom)
    : initialValue;
}
