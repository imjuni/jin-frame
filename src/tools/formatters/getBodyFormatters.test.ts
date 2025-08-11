import type { TSingleBodyFormatter } from '#interfaces/body/TSingleBodyFormatter';
import { getBodyFormatters } from '#tools/formatters/getBodyFormatters';
import { describe, expect, it } from 'vitest';

describe('getBodyFormatters', () => {
  it('should return multiple formatter when undefined', () => {
    const r01 = getBodyFormatters();
    const r02 = getBodyFormatters(undefined);

    expect(r01).toEqual([]);
    expect(r02).toEqual([]);
  });

  it('should return multiple formatter when singular formatter', () => {
    const formatter: TSingleBodyFormatter = { number: (v) => `${v}` };
    const result = getBodyFormatters(formatter);
    expect(result).toEqual([formatter]);
  });

  it('should return multiple formatter when singular formatter', () => {
    const formatter: TSingleBodyFormatter[] = [{ number: (v) => `${v}` }];
    const result = getBodyFormatters(formatter);
    expect(result).toEqual(formatter);
  });
});
