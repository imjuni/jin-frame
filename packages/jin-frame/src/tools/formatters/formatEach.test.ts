import { formatEach } from '#tools/formatters/formatEach';
import { describe, expect, it } from 'vitest';

describe('formatEach', () => {
  it('should return string when singular value and singular formatter', () => {
    const results = formatEach(1, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(results).toEqual('ABC:1');
  });

  it('should return string array when array value and singular formatter', () => {
    const results = formatEach([1, 2, 3], {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(results).toEqual(['ABC:1', 'ABC:2', 'ABC:3']);
  });
});
