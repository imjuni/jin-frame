import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import { getDefaultObjectBodyFieldOption } from '#processors/default-option/getDefaultObjectBodyFieldOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultObjectBodyFieldOption', () => {
  it('should return default object body field option when no parameters provided', () => {
    const option = getDefaultObjectBodyFieldOption();

    expect(option).toEqual({
      key: '',
      type: 'object-body',
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('should apply formatter when provided', () => {
    const f: TSingleBodyFormatter = { findFrom: 'f', string: (s) => `f:${s}` };
    const option = getDefaultObjectBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: f,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('should handle undefined formatter correctly', () => {
    const option = getDefaultObjectBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: undefined,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('should set order when provided', () => {
    const r01 = getDefaultObjectBodyFieldOption({ order: 1 });
    expect(r01).toMatchObject({
      type: 'object-body',
      encode: true,
      order: 1,
    });
  });

  it('should disable encoding when encode option is false', () => {
    const r01 = getDefaultObjectBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'object-body',
      order: Number.MAX_SAFE_INTEGER,
      encode: false,
    });
  });
});
