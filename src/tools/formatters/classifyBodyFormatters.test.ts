import type { TSingleBodyFormatter } from '#interfaces/body/TSingleBodyFormatter';
import { classifyBodyFormatters } from '#tools/formatters/classifyBodyFormatters';
import { describe, expect, it } from 'vitest';

describe('classifyBodyFormatters', () => {
  const valid: TSingleBodyFormatter[] = [{ findFrom: 'a' }, { findFrom: 'b' }];
  const invalid: TSingleBodyFormatter[] = [{}, {}];

  it('should return classifed formatter when formatters', () => {
    const r01 = classifyBodyFormatters();
    const r02 = classifyBodyFormatters(undefined);

    expect(r01).toEqual({ valid: [], invalid: [] });
    expect(r02).toEqual({ valid: [], invalid: [] });
  });

  it('should return classifed formatter when formatters', () => {
    const results = classifyBodyFormatters([...valid, ...invalid]);
    expect(results.valid).toEqual(valid);
  });
});
