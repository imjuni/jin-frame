import { getObjectBodyField } from '#processors/getObjectBodyField';
import { describe, expect, it } from 'vitest';

describe('getObjectBodyField', () => {
  it('should return origin object instance when key field is null', () => {
    const data = { name: null };
    const results = getObjectBodyField(data, {
      key: 'name',
      option: {
        type: 'object-body',
        formatters: {
          number: (v) => `${v}`,
        },
      },
    });

    expect(results).toEqual(data);
  });
});
