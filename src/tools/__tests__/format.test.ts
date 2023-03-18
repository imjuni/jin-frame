/* eslint-disable max-classes-per-file, no-console, import/no-extraneous-dependencies */

import applyFormatters from '#tools/formatters/applyFormatters';
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
    const dtStrVal = applyFormatters('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    });

    const dtval = applyFormatters('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(dtStrVal).toEqual(new Date(2023, 0, 20, 11, 22, 33));
    expect(dtval).toEqual('2023-01-20');
  });

  test('array', () => {
    const dts = applyFormatters(['2023-01-18T11:22:33', '2023-01-19T09:11:22', '2023-01-20T11:22:33'], {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    });

    expect(dts).toEqual([
      new Date(2023, 0, 18, 11, 22, 33),
      new Date(2023, 0, 19, 9, 11, 22),
      new Date(2023, 0, 20, 11, 22, 33),
    ]);
  });
});
