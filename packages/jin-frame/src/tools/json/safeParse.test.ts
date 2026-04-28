import { describe, expect, it } from 'vitest';
import { safeParse } from '#tools/json/safeParse';

describe('safeParse', () => {
  it('should parse JSON object when valid JSON string provided', () => {
    expect(safeParse('{"key":"value"}')).toEqual({ key: 'value' });
  });

  it('should parse JSON array when valid JSON array string provided', () => {
    expect(safeParse('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('should parse boolean true when JSON boolean string provided', () => {
    expect(safeParse('true')).toBe(true);
  });

  it('should parse boolean false when JSON boolean string provided', () => {
    expect(safeParse('false')).toBe(false);
  });

  it('should parse number when JSON number string provided', () => {
    expect(safeParse('42')).toBe(42);
  });

  it('should parse null when JSON null string provided', () => {
    expect(safeParse('null')).toBeNull();
  });

  it('should return raw string when plain non-JSON string provided', () => {
    expect(safeParse('hello')).toBe('hello');
  });

  it('should return raw string when API returns plain text response', () => {
    expect(safeParse('plain text response')).toBe('plain text response');
  });
});
