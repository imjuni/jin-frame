import { formatting } from '#tools/formatters/formatting';
import { format, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('formatting', () => {
  it('should return formatted string when without order', () => {
    const val = formatting(123, {
      number: (num) => `${num}`,
      string: (str) => `ABC:${str}`,
    });

    expect(val).toEqual('ABC:123');
  });

  it('should return formatted string when number formatter and order', () => {
    const val = formatting(123, {
      order: ['string', 'number', 'dateTime'],
      number: (num) => `${num}`,
    });

    expect(val).toEqual('123');
  });

  it('should return formatted string when string formatter and order and number value', () => {
    const num = formatting(123, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(num).toEqual(`ABC:123`);
  });

  it('should return formatted string when string formatter and order and boolean value', () => {
    const bool = formatting(true, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(bool).toEqual(`ABC:true`);
  });

  it('should return date object when string formatter and ordered and string value', () => {
    const dtStrVal = formatting('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    });

    expect(dtStrVal).toEqual(new Date(2023, 0, 20, 11, 22, 33));
  });

  it('should return date object when string, dateTime formatter and ordered and string value', () => {
    const dtval = formatting('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(dtval).toEqual('2023-01-20');
  });

  it('should return formatted string when string formatter and ordered and object value', () => {
    const objectVal = formatting(
      { name: 'ironman' },
      {
        order: ['string', 'number', 'dateTime'],
        string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      },
    );

    expect(objectVal).toEqual('{"name":"ironman"}');
  });

  it('should raise error when formatting', () => {
    expect(() => {
      formatting(123, {
        ignoreError: false,
        string: () => new Date(),
        dateTime: () => {
          throw new Error('raise error when processing in formatting');
        },
      });
    }).toThrowError();
  });
});
