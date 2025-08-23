import { formattings } from '#tools/formatters/formattings';
import { describe, expect, it, vitest } from 'vitest';

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

  it('show return formatted value when array formatter', () => {
    vitest.setSystemTime(new Date(2025, 7, 23, 1, 20, 33, 444));

    const val = formattings('2025-08-23T01:20:33.444', [
      { string: (s: string) => s.trim() },
      { string: (s: string) => new Date(s) }, // string → Date
      { dateTime: (d: Date) => `${Math.floor(d.getTime())}` }, // Date → epoch
    ]);

    vitest.useRealTimers();

    expect(val).toEqual('1755879633444');
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
