import { bodyFormatEach } from '#tools/formatters/bodyFormatEach';
import { describe, expect, it } from 'vitest';

describe('formatEach', () => {
  it('should return string when singular value and singular formatter', () => {
    const results = bodyFormatEach(
      { hero: { name: 'ironman' } },
      {
        findFrom: 'hero.name',
        order: ['string', 'number', 'dateTime'],
        string: (str) => `marvel:${str}`,
      },
    );

    expect(results).toEqual({ hero: { name: 'marvel:ironman' } });
  });

  it('should return string array when array value and singular formatter', () => {
    const results = bodyFormatEach([{ hero: { name: 'ironman' } }, { hero: { name: 'hulk' } }], {
      findFrom: 'hero.name',
      order: ['string', 'number', 'dateTime'],
      string: (str) => `marvel:${str}`,
    });

    expect(results).toEqual([{ hero: { name: 'marvel:ironman' } }, { hero: { name: 'marvel:hulk' } }]);
  });
});
