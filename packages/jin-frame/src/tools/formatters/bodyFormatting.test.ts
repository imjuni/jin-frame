import { bodyFormatting } from '#tools/formatters/bodyFormatting';
import { describe, expect, it } from 'vitest';
import { format, parse } from 'date-fns';

describe('bodyFormatting', () => {
  it('should return formatted object when object with formatter', () => {
    const data = { hero: { name: 'ironman', born: '1970-05-29T11:22:33' } };

    const results = bodyFormatting(data, {
      order: ['string', 'number', 'dateTime'],
      findFrom: 'hero.born',
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(results).toEqual({ hero: { name: 'ironman', born: '1970-05-29' } });
  });

  it('should return undefined when raise error', () => {
    const data = { hero: { name: 'ironman', born: '1970-05-29T11:22:33' } };

    const result = bodyFormatting(data, {
      order: ['string', 'number', 'dateTime'],
      findFrom: 'hero.born',
      string: () => {
        throw new Error('raise error');
      },
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(result).toBeUndefined();
  });

  it('should throw error when raise error', () => {
    const data = { hero: { name: 'ironman', born: '1970-05-29T11:22:33' } };

    expect(() => {
      bodyFormatting(data, {
        order: ['string', 'number', 'dateTime'],
        findFrom: 'hero.born',
        ignoreError: false,
        string: () => {
          throw new Error('raise error');
        },
        dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
      });
    }).toThrowError();
  });
});
