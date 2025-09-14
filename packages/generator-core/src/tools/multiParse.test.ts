import { multiParse } from '#/tools/multiParse';
import { describe, expect, it } from 'vitest';

describe('multiParse', () => {
  it('should return the parsed value when the value is JSON', () => {
    const result = multiParse<{ a: number }>('{"a": 1}');
    expect(result).toEqual({ a: 1 });
  });

  it('should return the parsed value when the value is YAML', () => {
    const result = multiParse<{ a: number }>('a: 1');
    expect(result).toEqual({ a: 1 });
  });

  it('should return undefined when the value is not valid JSON or YAML', () => {
    const result = multiParse<{ a: number }>('{]');
    expect(result).toBeUndefined();
  });
});
