import { formattings } from '#tools/formatters/formattings';
import { describe, expect, it } from 'vitest';

describe('formattings', () => {
  it('show return formatted value when array formatter', () => {
    const val = formattings(123, [
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
    const val = formattings(123, [
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

  it('show return formatted value when singular formatter', () => {
    const val = formattings(123, {
      number: (num) => `${num}`,
      string: (str) => `ABC:${str}`,
    });

    expect(val).toEqual('ABC:123');
  });
});
