import { getCachePath } from '#tools/getCachePath';
import { describe, expect, it } from 'vitest';

describe('getCachePath', () => {
  it('getCachePath should return joined string with type and key', () => {
    const result = getCachePath({
      key: 'userId',
      type: 'query',
    });

    expect(result).toBe('query.userId');
  });

  it('getCachePath should use replaceAt when provided instead of key', () => {
    const result = getCachePath({
      key: 'userId',
      type: 'param',
      replaceAt: 'id',
    });

    expect(result).toBe('param.id');
  });

  it('getCachePath should work with header type', () => {
    const result = getCachePath({
      key: 'authorization',
      type: 'header',
    });

    expect(result).toBe('header.authorization');
  });

  it('getCachePath should work with body type', () => {
    const result = getCachePath({
      key: 'data',
      type: 'body',
    });

    expect(result).toBe('body.data');
  });

  it('getCachePath should work with object body type', () => {
    const result = getCachePath({
      key: 'user',
      type: 'object-body',
    });

    expect(result).toBe('body');
  });

  it('getCachePath should handle special characters in key', () => {
    const result = getCachePath({
      key: 'user-name',
      type: 'query',
    });

    expect(result).toBe('query.user-name');
  });

  it('getCachePath should handle special characters in replaceAt', () => {
    const result = getCachePath({
      key: 'userName',
      type: 'param',
      replaceAt: 'user_name',
    });

    expect(result).toBe('param.user_name');
  });
});
