import { stringifyExceptString } from '#tools/formatters/stringifyExceptString';
import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

describe('stringifyExceptString', () => {
  const fixedDateStr = '2025-01-01T11:22:33.444Z';
  const fixedDate = new Date(fixedDateStr);

  beforeAll(() => {
    vitest.useFakeTimers();
    vitest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    vitest.useRealTimers();
  });

  it('should stringified when primitive type which except string type', () => {
    const result = stringifyExceptString(1);
    expect(result).toEqual('1');
  });

  it('should iso datetime string when Date object', () => {
    const result = stringifyExceptString(new Date());
    expect(result).toEqual(fixedDateStr);
  });

  it('should bypass when string type', () => {
    const result = stringifyExceptString('1');

    expect(result).toEqual('1');
  });
});
