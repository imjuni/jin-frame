import { isValidNumberArray } from '#tools/type-narrowing/isValidNumberArray';
import { describe, expect, it } from 'vitest';

describe('isValidNumberArray', () => {
  it('number array', () => {
    const r = isValidNumberArray([1, 2, 3, 4]);
    expect(r).toBeTruthy();
  });

  it('complex type array', () => {
    const r = isValidNumberArray([1, '2', 3, 4]);
    expect(r).toBeFalsy();
  });

  it('object', () => {
    const r = isValidNumberArray({ name: 'ironman' });
    expect(r).toBeFalsy();
  });
});
