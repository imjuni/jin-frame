import type { IFormatter } from '#interfaces/options/IFormatter';
import { getDefaultQueryFieldOption } from '#processors/default-option/getDefaultQueryFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultQueryFieldOption', () => {
  it('should return default query field option when no parameters provided', () => {
    const option = getDefaultQueryFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'query',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      keyFormat: undefined,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should apply formatter when provided', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultQueryFieldOption({ formatters: f });

    expect(option).toMatchObject({
      key: '',
      type: 'query',
      cacheKeyExclude: false,
      formatters: f,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should enable comma when comma option is true', () => {
    const r01 = getDefaultQueryFieldOption({ comma: true });
    expect(r01).toMatchObject({
      key: '',
      type: 'query',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: true,
      bit: {
        enable: false,
        withZero: false,
      },
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should disable encoding when encode option is false', () => {
    const r01 = getDefaultQueryFieldOption({ encode: false });
    expect(r01).toMatchObject({
      key: '',
      type: 'query',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      replaceAt: undefined,
      encode: false,
    });
  });

  it('should configure bit options when bit parameters are provided', () => {
    const r01 = getDefaultQueryFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'query',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: false,
      },
      replaceAt: undefined,
      encode: true,
    });

    const r02 = getDefaultQueryFieldOption({ bit: { enable: true, withZero: true } });
    expect(r02).toMatchObject({
      type: 'query',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: true,
      },
      replaceAt: undefined,
      encode: true,
    });
  });
});
