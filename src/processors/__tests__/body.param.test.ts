import { getBodyInfo } from '@processors/getBodyInfo';
import { format, parse } from 'date-fns';
import 'jest';

describe('getBodyInfo', () => {
  test('formatter', () => {
    const r01 = getBodyInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'body',
          formatters: {
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '20/Jan/2023' });
  });

  test('formatter - array', () => {
    const r01 = getBodyInfo({ fm: ['2023-01-19', '2023-01-20'] }, [
      {
        key: 'fm',
        option: {
          type: 'body',
          formatters: [
            {
              string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
              dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
            },
          ],
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: ['19/Jan/2023', '20/Jan/2023'] });
  });

  test('formatter - exception', () => {
    const r01 = getBodyInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'body',
          formatters: {
            string: () => {
              throw new Error('formatter exception');
            },
          },
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });

  test('array', () => {
    const r01 = getBodyInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'body',
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: ['ironman', 'captain'] });
  });

  test('plain value', () => {
    const r01 = getBodyInfo({ hero: 'ironman' }, [
      {
        key: 'hero',
        option: {
          type: 'body',
        },
      },
    ]);

    expect(r01).toMatchObject({ hero: 'ironman' });
  });

  test('null value', () => {
    const r01 = getBodyInfo({ hero: null }, [
      {
        key: 'hero',
        option: {
          type: 'body',
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });

  test('object value', () => {
    const r01 = getBodyInfo({ hero: { name: 'ironman' } }, [
      {
        key: 'hero',
        option: { type: 'body' },
      },
    ]);

    expect(r01).toMatchObject({ hero: { name: 'ironman' } });
  });

  test('exception value', () => {
    try {
      const sym = Symbol('ironman');
      getBodyInfo(
        { hero: sym },
        [
          {
            key: 'hero',
            option: { type: 'body' },
          },
        ],
        true,
      );
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('invalid value', () => {
    const sym = Symbol('ironman');
    const r01 = getBodyInfo({ hero: sym }, [
      {
        key: 'hero',
        option: { type: 'body' },
      },
    ]);

    expect(r01).toMatchObject({});
  });
});
