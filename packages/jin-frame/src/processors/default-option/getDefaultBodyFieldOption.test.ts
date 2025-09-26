import type { IFormatter } from '#interfaces/options/IFormatter';
import { getDefaultBodyFieldOption } from '#processors/default-option/getDefaultBodyFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultBodyFieldOption', () => {
  it('should return default body field option when no parameters provided', () => {
    const option = getDefaultBodyFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'body',
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should apply formatter when provided', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'body',
      formatters: f,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should handle undefined formatter correctly', () => {
    const option = getDefaultBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'body',
      formatters: undefined,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('should set replaceAt when provided', () => {
    const r01 = getDefaultBodyFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  it('should disable encoding when encode option is false', () => {
    const r01 = getDefaultBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: undefined,
      encode: false,
    });
  });
});
