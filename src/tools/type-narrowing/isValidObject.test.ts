import { isValidObject } from '#tools/type-narrowing/isValidObject';
import { describe, expect, it } from 'vitest';

describe('isValidObject', () => {
  it('more then one key', () => {
    const r = isValidObject({ name: 'ironman' });
    expect(r).toBeTruthy();
  });

  it('null', () => {
    const r = isValidObject(null);
    expect(r).toBeFalsy();
  });

  it('undefined', () => {
    const r = isValidObject(undefined);
    expect(r).toBeFalsy();
  });

  it('array', () => {
    const r = isValidObject([]);
    expect(r).toBeFalsy();
  });

  it('empty object', () => {
    const r = isValidObject({});
    expect(r).toBeFalsy();
  });
});
