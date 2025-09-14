import { applyFormat } from '#tools/formatters/applyFormat';
import { describe, expect, it } from 'vitest';
import { format, parse } from 'date-fns';

describe('applyFormat', () => {
  it('should return formatted string when without order', () => {
    const val = applyFormat(123, {
      number: (num) => `${num}`,
      string: (str) => `ABC:${str}`,
    });

    expect(val).toEqual('ABC:123');
  });

  it('should return formatted string when string formatter and order and number value', () => {
    const num = applyFormat(123, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(num).toEqual(`ABC:123`);
  });

  it('should return formatted string when string formatter and order and boolean value', () => {
    const bool = applyFormat(true, {
      order: ['string', 'number', 'dateTime'],
      string: (str) => `ABC:${str}`,
    });

    expect(bool).toEqual(`ABC:true`);
  });

  it('should return date object when string formatter and ordered and string value', () => {
    const dtStrVal = applyFormat('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    });

    expect(dtStrVal).toEqual(new Date(2023, 0, 20, 11, 22, 33));
  });

  it('should return date object when string, dateTime formatter and ordered and string value', () => {
    const dtval = applyFormat('2023-01-20T11:22:33', {
      order: ['string', 'number', 'dateTime'],
      string: (dt) => parse(dt, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
      dateTime: (dt) => format(dt, 'yyyy-MM-dd'),
    });

    expect(dtval).toEqual('2023-01-20');
  });
});
