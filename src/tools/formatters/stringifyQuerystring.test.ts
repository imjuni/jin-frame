import { stringifyQuerystring } from '#tools/formatters/stringifyQuerystring';
import { describe, expect, it, vitest, beforeAll, afterAll } from 'vitest';

describe('stringifyQuerystring', () => {
  const fixedDateStr = '2025-01-01T11:22:33.444Z';
  const fixedDate = new Date(fixedDateStr);

  beforeAll(() => {
    vitest.useFakeTimers();
    vitest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    vitest.useRealTimers();
  });

  it('should return string when singular value', () => {
    const r01 = stringifyQuerystring(1);
    expect(r01).toEqual('1');
  });

  it('should return string when singular value and encoding', () => {
    const r01 = stringifyQuerystring(1, { encode: true });
    expect(r01).toEqual('1');
  });

  it('should return comma separated string when array and comma option true', () => {
    const r01 = stringifyQuerystring([1, 2], { comma: true });
    expect(r01).toEqual('1,2');
  });

  it('should return comma separated string when array and comma option false', () => {
    const r01 = stringifyQuerystring([1, 2], { comma: false });
    expect(r01).toEqual(['1', '2']);
  });

  it('should return comma separated string when array and comma option ignored', () => {
    const r01 = stringifyQuerystring([1, 2]);
    expect(r01).toEqual(['1', '2']);
  });
});
