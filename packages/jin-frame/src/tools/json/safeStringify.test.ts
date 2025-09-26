import { safeStringify } from '#tools/json/safeStringify';
import { describe, expect, it } from 'vitest';

describe('safeStringify', () => {
  it('should return stringified JSON when serialization succeeds', () => {
    const obj = { name: 'test', value: 123 };
    const result = safeStringify(obj);
    expect(result).toEqual('{"name":"test","value":123}');
  });

  it('should return undefined when serialization fails', () => {
    const objWithCircularRef: any = { name: 'test' };
    objWithCircularRef.self = objWithCircularRef;
    const result = safeStringify(objWithCircularRef);
    expect(result).toBeUndefined();
  });
});
