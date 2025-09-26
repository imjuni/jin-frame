import type { IFormatter } from '#interfaces/options/IFormatter';
import { getDefaultParamFieldOption } from '#processors/default-option/getDefaultParamFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultParamFieldOption', () => {
  it('should return default param field option when no parameters provided', () => {
    const option = getDefaultParamFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'param',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should apply formatter when provided', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultParamFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'param',
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
    const r01 = getDefaultParamFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'param',
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
    const r01 = getDefaultParamFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'param',
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
    const r01 = getDefaultParamFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'param',
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

    const r02 = getDefaultParamFieldOption({ bit: { enable: true, withZero: true } });
    expect(r02).toMatchObject({
      type: 'param',
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
