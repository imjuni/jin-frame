import { bodyFormattings } from '#tools/formatters/bodyFormattings';
import { describe, expect, it } from 'vitest';

describe('bodyFormattings', () => {
  it('should return origin undefined when initial value is undefined', () => {
    const val = bodyFormattings(123, [
      {
        number: (num) => `${num}`,
        string: (str) => `ABC:${str}`,
      },
      {
        number: (num) => `${num}`,
        string: (str) => `ABC:${str}`,
      },
    ]);

    expect(val).toEqual('ABC:ABC:123');
  });

  it('show return formatted value when formatting fail by raise error', () => {
    const val = bodyFormattings(123, [
      {
        number: (num) => `${num}`,
        string: (str) => `ABC:${str}`,
      },
      {
        number: (num) => `${num}`,
        string: () => {
          throw new Error('raise error');
        },
      },
    ]);

    expect(val).toEqual('ABC:123');
  });
});
