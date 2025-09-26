import type { IFormatter } from '#interfaces/options/IFormatter';
import { getDefaultHeaderFieldOption } from '#processors/default-option/getDefaultHeaderFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultHeaderFieldOption', () => {
  it('should return default header field option when no parameters provided', () => {
    const option = getDefaultHeaderFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'header',
      cacheKeyExclude: false,
      bit: {
        enable: false,
        withZero: false,
      },
      formatters: undefined,
      replaceAt: undefined,
      comma: false,
      encode: true,
    });
  });

  it('should apply formatter when provided', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultHeaderFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'header',
      cacheKeyExclude: false,
      formatters: f,
      comma: false,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should set replaceAt when provided', () => {
    const r01 = getDefaultHeaderFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'header',
      cacheKeyExclude: false,
      comma: false,
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  it('should enable comma when comma option is true', () => {
    const r01 = getDefaultHeaderFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'header',
      cacheKeyExclude: false,
      comma: true,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should disable encoding when encode option is false', () => {
    const r01 = getDefaultHeaderFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'header',
      cacheKeyExclude: false,
      comma: false,
      replaceAt: undefined,
      encode: false,
    });
  });

  it('should handle undefined formatter correctly', () => {
    const option = getDefaultHeaderFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'header',
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should return default header field option when bit configuration is provided', () => {
    const option = getDefaultHeaderFieldOption({ bit: { enable: true, withZero: true } });

    expect(option).toMatchObject({
      type: 'header',
      bit: { enable: true, withZero: true },
      cacheKeyExclude: false,
      formatters: undefined,
      comma: false,
      replaceAt: undefined,
      encode: true,
    });
  });
});
