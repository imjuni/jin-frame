import { safeParse } from '#/tools/safeParse';
import { describe, expect, it } from 'vitest';

describe('safeParse', () => {
  it('should return the parsed value', () => {
    const result = safeParse('{"a": 1}');
    expect(result).toEqual({ a: 1 });
  });

  it('should return undefined when the value is not valid JSON', () => {
    const result = safeParse('{]');
    expect(result).toBeUndefined();
  });
});
