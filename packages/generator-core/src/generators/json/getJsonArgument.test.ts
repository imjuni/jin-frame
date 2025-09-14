import { getJsonArgument } from '#/generators/json/getJsonArgument';
import { describe, expect, it } from 'vitest';

describe('getJsonArgument', () => {
  it('should generate object literal string filtering out undefined values when values contain primitive types', () => {
    const result = getJsonArgument({
      values: [
        { key: 'host', value: 'localhost' },
        undefined,
        { key: 'timeout', value: 5000 },
        { key: 'useInstance', value: false },
      ],
    });

    expect(result).toEqual("{ host: 'localhost', timeout: 5000, useInstance: false }");
  });

  it('should exclude complex object values when generating object literal string', () => {
    const result = getJsonArgument({
      values: [
        { key: 'host', value: 'localhost' },
        {
          key: 'timeout',
          value: { a: 1, b: 2 } as any,
        },
      ],
    });
    expect(result).toEqual("{ host: 'localhost' }");
  });

  it('should return undefined when values parameter is undefined', () => {
    const result = getJsonArgument({
      values: undefined,
    });

    expect(result).toBeUndefined();
  });
});
