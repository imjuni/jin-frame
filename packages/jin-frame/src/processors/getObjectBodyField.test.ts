import { getObjectBodyField } from '#processors/getObjectBodyField';
import { describe, expect, it } from 'vitest';

describe('getObjectBodyField', () => {
  it('should return origin object instance when key field is null', () => {
    const data = BigInt(1);
    const results = getObjectBodyField(data, {
      key: 'name',
      option: {
        type: 'object-body',
        order: Number.MAX_SAFE_INTEGER,
        formatters: {
          number: (v) => `primitive:${v}`,
        },
      },
    });

    expect(results).toEqual(data);
  });

  it('should return origin object instance when key field is null', () => {
    const data = { name: null };
    const results = getObjectBodyField(data, {
      key: 'name',
      option: {
        type: 'object-body',
        order: Number.MAX_SAFE_INTEGER,
        formatters: {
          number: (v) => `${v}`,
        },
      },
    });

    expect(results).toEqual(data);
  });
});
