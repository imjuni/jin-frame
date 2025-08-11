import { setToBody } from '#tools/formatters/setToBody';
import { describe, expect, it } from 'vitest';

describe('setToBody', () => {
  it('should return undefined when pass undefined', () => {
    const r01 = setToBody(undefined, undefined, undefined);
    expect(r01).toBeUndefined();
  });

  it('should return array when pass array', () => {
    const r01 = setToBody([], undefined, undefined);
    expect(r01).toEqual([]);
  });

  it('should return primitive type when pass primitive type', () => {
    const r01 = setToBody(1, undefined, undefined);
    expect(r01).toEqual(1);
  });

  it('should return origin object when pass undefined find-from-key', () => {
    const data = { name: 'ironman' };
    const r01 = setToBody(data, undefined, undefined);
    expect(r01).toEqual(data);
  });

  it('should return formatted when pass undefined find-from-key', () => {
    const r01 = setToBody(1, '1', undefined);
    expect(r01).toEqual('1');
  });

  it('should return origin value pass find-from-key and undefind formatting value', () => {
    const r01 = setToBody(1, undefined, 'a');
    expect(r01).toEqual(1);
  });

  it('should return replace object when pass find-from-key', () => {
    const data = { name: 'ironman' };
    const r01 = setToBody(data, 'hulk', 'name');
    expect(r01).toEqual({ name: 'hulk' });
  });
});
