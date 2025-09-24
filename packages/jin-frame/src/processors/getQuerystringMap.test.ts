import { getQuerystringMap } from '#processors/getQuerystringMap';
import { format, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('getQuerystringMap', () => {
  it('should return complex type with map when value is complex type', () => {
    const map = getQuerystringMap(
      {
        val: { name: 'ironman' },
      },
      [{ key: 'val', type: 'query', bit: { enable: false, withZero: false }, comma: false }],
    );

    expect(map).toEqual({ val: '{"name":"ironman"}' });
  });

  it('should return bitwized when array number', () => {
    const result = getQuerystringMap({ bit: [0b1, 0b10, 0b1000] }, [
      { key: 'bit', type: 'query', bit: { enable: true, withZero: false }, comma: false },
    ]);

    expect(result).toMatchObject({ bit: '11' });
  });

  it('should return bitwized 0 when array number', () => {
    const result = getQuerystringMap({ bit: [0] }, [
      { key: 'bit', type: 'query', bit: { enable: true, withZero: true }, comma: false },
    ]);

    expect(result).toMatchObject({ bit: '0' });
  });

  it('should return empty map when zero number and withZero set false', () => {
    const result = getQuerystringMap({ bit: [0] }, [
      { key: 'bit', type: 'query', bit: { enable: true, withZero: false }, comma: false },
    ]);

    expect(result).toMatchObject({});
  });

  it('should return formatted map when string value with singular formatter', () => {
    const r01 = getQuerystringMap({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        type: 'query',
        bit: { enable: false, withZero: false },
        comma: false,
        formatters: {
          string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
          dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '20/Jan/2023' });
  });

  it('should return formatted map when string array with singular formatter', () => {
    const r01 = getQuerystringMap({ fm: ['2023-01-19', '2023-01-20'] }, [
      {
        key: 'fm',
        type: 'query',
        bit: { enable: false, withZero: false },
        comma: true,
        formatters: {
          string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
          dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '19/Jan/2023,20/Jan/2023' });
  });

  it('should return comma seperate string map when string array', () => {
    const r01 = getQuerystringMap({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        type: 'query',
        bit: { enable: false, withZero: false },
        comma: true,
      },
    ]);

    expect(r01).toMatchObject({ heroes: 'ironman,captain' });
  });
});
