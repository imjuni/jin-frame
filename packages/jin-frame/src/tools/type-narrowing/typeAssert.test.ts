import { typeAssert } from '#tools/type-narrowing/typeAssert';
import { describe, expect, it } from 'vitest';

describe('typeAssert', () => {
  it('raise exception -1', () => {
    try {
      typeAssert(true, Symbol('Symbol'));
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('primitive', () => {
    const r01 = typeAssert(true, 1);
    const r02 = typeAssert(false, Symbol('S'));
    expect(r01).toBeTruthy();
    expect(r02).toBeFalsy();
  });

  it('array', () => {
    const str = typeAssert(true, ['a', 'b', 'c']);
    const num = typeAssert(true, [1, 2, 3]);
    const bool = typeAssert(true, [true, true, false]);
    const date = typeAssert(true, [new Date(), new Date(), new Date()]);

    expect(str).toBeTruthy();
    expect(num).toBeTruthy();
    expect(bool).toBeTruthy();
    expect(date).toBeTruthy();
  });
});
