import { getQueryParamInfo } from '#processors/getQueryParamInfo';
import { format, parse } from 'date-fns';
import 'jest';

describe('getQueryParamInfo', () => {
  test('bitwized', () => {
    const r01 = getQueryParamInfo({ bit: [0b1, 0b10, 0b1000] }, [
      { key: 'bit', option: { type: 'query', bit: { enable: true, withZero: false }, comma: false } },
    ]);

    const r02 = getQueryParamInfo({ bit: [0] }, [
      { key: 'bit', option: { type: 'query', bit: { enable: true, withZero: true }, comma: false } },
    ]);

    const r03 = getQueryParamInfo({ bit: [0] }, [
      { key: 'bit', option: { type: 'query', bit: { enable: true, withZero: false }, comma: false } },
    ]);

    expect(r01).toMatchObject({ bit: 11 });
    expect(r02).toMatchObject({ bit: 0 });
    expect(r03).toMatchObject({});
  });

  test('formatter', () => {
    const r01 = getQueryParamInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: false,
          formatter: { string: (v) => parse(v, 'yyyy-MM-dd', new Date()), dateTime: (dt) => format(dt, 'dd/MMM/yyyy') },
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '20/Jan/2023' });
  });

  test('formatter - array', () => {
    const r01 = getQueryParamInfo({ fm: ['2023-01-19', '2023-01-20'] }, [
      {
        key: 'fm',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: true,
          formatter: { string: (v) => parse(v, 'yyyy-MM-dd', new Date()), dateTime: (dt) => format(dt, 'dd/MMM/yyyy') },
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '19/Jan/2023,20/Jan/2023' });
  });

  test('formatter - exception', () => {
    const r01 = getQueryParamInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: false,
          formatter: {
            string: () => {
              throw new Error('formatter exception');
            },
          },
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });

  test('array - comma', () => {
    const r01 = getQueryParamInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: 'ironman,captain' });
  });

  test('array - formatted', () => {
    const r01 = getQueryParamInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: false,
          formatter: {
            string: (value) => `marvel-${value}`,
          },
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: ['marvel-ironman', 'marvel-captain'] });
  });

  test('array', () => {
    const r01 = getQueryParamInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: false,
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: ['ironman', 'captain'] });
  });

  test('plain value', () => {
    const r01 = getQueryParamInfo({ hero: 'ironman' }, [
      {
        key: 'hero',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({ hero: 'ironman' });
  });

  test('null value', () => {
    const r01 = getQueryParamInfo({ hero: null }, [
      {
        key: 'hero',
        option: {
          type: 'query',
          bit: { enable: false, withZero: false },
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });
});
