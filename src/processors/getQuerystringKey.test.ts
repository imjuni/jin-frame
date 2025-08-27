import { getQuerystringKey } from '#processors/getQuerystringKey';
import { describe, it, expect } from 'vitest';

describe('getQuerystringKey', () => {
  it('should original key when not format', () => {
    const result = getQuerystringKey({
      key: 'ironman',
      index: 0,
    });
    expect(result).toEqual('ironman');
  });

  it('should original key when brackets format', () => {
    const result = getQuerystringKey({
      key: 'ironman',
      index: 0,
      format: 'brackets',
    });
    expect(result).toEqual('ironman[]');
  });

  it('should original key when indices format', () => {
    const result = getQuerystringKey({
      key: 'ironman',
      index: 0,
      format: 'indices',
    });
    expect(result).toEqual('ironman[0]');
  });

  it('should original key when one-indices format', () => {
    const result = getQuerystringKey({
      key: 'ironman',
      index: 0,
      format: 'one-indices',
    });
    expect(result).toEqual('ironman[1]');
  });
});
