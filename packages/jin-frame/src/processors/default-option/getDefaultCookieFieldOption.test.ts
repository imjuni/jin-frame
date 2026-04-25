import type { IFormatter } from '#interfaces/options/IFormatter';
import { getDefaultCookieFieldOption } from '#processors/default-option/getDefaultCookieFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultCookieFieldOption', () => {
  it('should return default cookie field option when no parameters provided', () => {
    const option = getDefaultCookieFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'cookie',
      cacheKeyExclude: false,
      bit: {
        enable: false,
        withZero: false,
      },
      formatters: undefined,
      replaceAt: undefined,
      comma: false,
      encode: false,
    });
  });

  it('should set bit options when bit configuration is provided', () => {
    const option = getDefaultCookieFieldOption({ bit: { enable: true, withZero: true } });

    expect(option).toMatchObject({
      type: 'cookie',
      bit: { enable: true, withZero: true },
    });
  });

  it('should set replaceAt when provided', () => {
    const option = getDefaultCookieFieldOption({ replaceAt: 'session_id' });

    expect(option).toMatchObject({ type: 'cookie', replaceAt: 'session_id' });
  });

  it('should apply formatter when provided', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultCookieFieldOption({ formatters: f });

    expect(option).toMatchObject({ type: 'cookie', formatters: f });
  });

  it('should set cacheKeyExclude when provided', () => {
    const option = getDefaultCookieFieldOption({ cacheKeyExclude: true });

    expect(option).toMatchObject({ type: 'cookie', cacheKeyExclude: true });
  });

  it('should enable encoding when encode option is true', () => {
    const option = getDefaultCookieFieldOption({ encode: true });

    expect(option).toMatchObject({ type: 'cookie', encode: true });
  });
});
