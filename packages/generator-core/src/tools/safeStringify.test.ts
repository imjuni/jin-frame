import { safeStringify } from '#/tools/safeStringify';
import { describe, expect, it } from 'vitest';

describe('safeStringify', () => {
  it('should return the stringified value', () => {
    const result = safeStringify({ a: 1 });
    expect(result).toEqual('{"a":1}');
  });

  it('should return empty string when circular reference occurs', () => {
    const obj: any = { name: 'test' };
    obj.self = obj; // recursive reference
    const result = safeStringify(obj);
    expect(result).toEqual('');
  });

  it('should return empty string when BigInt is present', () => {
    const obj = { value: 123n };
    const result = safeStringify(obj);
    expect(result).toEqual('');
  });

  it('should return empty string when toJSON throws error', () => {
    const obj = {
      toJSON() {
        throw new Error('toJSON error');
      },
    };
    const result = safeStringify(obj);
    expect(result).toEqual('');
  });

  it('should handle functions and symbols gracefully', () => {
    const obj = {
      fn: () => 'test',
      sym: Symbol('test'),
      value: 42,
    };
    const result = safeStringify(obj);
    expect(result).toEqual('{"value":42}');
  });
});
