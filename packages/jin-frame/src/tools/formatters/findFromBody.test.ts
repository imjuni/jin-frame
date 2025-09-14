import { findFromBody } from '#tools/formatters/findFromBody';
import { describe, expect, it } from 'vitest';

describe('findFromBody', () => {
  it('should return origin undefined when initial value is undefined', () => {
    const results = findFromBody(undefined, 'a');
    expect(results).toBeUndefined();
  });

  it('should return origin number when initial value is number', () => {
    const results = findFromBody(1, 'a');
    expect(results).toEqual(1);
  });

  it('should return origin array when initial value is array', () => {
    const results = findFromBody([], 'a');
    expect(results).toEqual([]);
  });

  it('should return origin undefined when initial value is undefined', () => {
    const results = findFromBody(undefined, undefined);
    expect(results).toBeUndefined();
  });

  it('should return finded value when initial value is object and find from key passed', () => {
    const results = findFromBody({ hero: { name: 'ironman' } }, 'hero.name');
    expect(results).toEqual('ironman');
  });
});
