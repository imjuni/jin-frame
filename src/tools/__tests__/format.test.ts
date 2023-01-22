/* eslint-disable max-classes-per-file, no-console */
import { applyFormatters } from '@tools/applyFormatters';
import { format, parse } from 'date-fns';
import 'jest';

describe('applyFormatters', () => {
  test('no-order', () => {
    const val = applyFormatters(123, {
      number: (num) => `${num}`,
      string: (str) => `ABC:${str}`,
    });

    expect(val).toEqual('ABC:123');
  });

  test('number', () => {
    const val = applyFormatters(123, {
      order: ['string', 'number', 'dateTime'],
      number: (num) => `${num}`,
    });

    expect(val).toEqual('123');
  });

  test('string', () => {
    const num = applyFormatters(123, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    const bool = applyFormatters(true, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(num).toEqual(`ABC:123`);
    expect(bool).toEqual(`ABC:true`);
  });

  test('datetime', () => {
    const dtStrVal = applyFormatters('2023-01-20T11:22:33+09:00', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date()),
    });

    const dtval = applyFormatters('2023-01-20T11:22:33+09:00', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date()),
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(dtStrVal).toEqual('2023-01-20T11:22:33+09:00');
    expect(dtval).toEqual('2023-01-20');
  });

  test('array', () => {
    const dts = applyFormatters(
      ['2023-01-18T11:22:33+09:00', '2023-01-19T09:11:22+09:00', '2023-01-20T11:22:33+09:00'],
      {
        order: ['string', 'number', 'dateTime'],
        string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date()),
      },
    );

    expect(dts).toEqual(['2023-01-18T11:22:33+09:00', '2023-01-19T09:11:22+09:00', '2023-01-20T11:22:33+09:00']);
  });
});
