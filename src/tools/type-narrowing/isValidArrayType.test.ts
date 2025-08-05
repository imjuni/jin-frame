import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { describe, expect, it } from 'vitest';

describe('isValidArrayType', () => {
  it('valid array', () => {
    const r = isValidArrayType([1, '2', true, new Date()]);
    expect(r).toBeTruthy();
  });

  it('invalid array', () => {
    const r = isValidArrayType([1, { name: 'ironman' }, '2', true, new Date()]);
    expect(r).toBeFalsy();
  });
});
