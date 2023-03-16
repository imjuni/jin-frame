import { getBodyInfo } from '#processors/getBodyInfo';
import { format, parse } from 'date-fns';
import 'jest';

describe('getBodyInfo', () => {
  test('formatter', () => {
    const r01 = getBodyInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
    ]);

    expect(r01).toEqual('20/Jan/2023');
  });

  test('sort - 1', () => {
    const r01 = getBodyInfo({ f01: '2023-01-20', f02: '2023-01-19', f03: '2023-01-18' }, [
      {
        key: 'f01',
        option: {
          order: 2,
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
      {
        key: 'f02',
        option: {
          order: 1,
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
      {
        key: 'f03',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
    ]);

    expect(r01).toEqual('19/Jan/2023');
  });

  test('sort - 2', () => {
    const r01 = getBodyInfo({ f01: '2023-01-20', f02: '2023-01-19', f03: '2023-01-18' }, [
      {
        key: 'f01',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
      {
        key: 'f02',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
      {
        key: 'f03',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
    ]);

    expect(r01).toEqual('20/Jan/2023');
  });

  test('primitive exception', () => {
    try {
      getBodyInfo({ fm: '2023-01-20' }, [
        {
          key: 'fm',
          option: {
            type: 'object-body',
            formatters: {
              findFrom: '',
              string: () => {
                throw new Error('format exception');
              },
            },
          },
        },
      ]);
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  test('formatter - array', () => {
    const r01 = getBodyInfo({ fm: ['2023-01-19', '2023-01-20'] }, [
      {
        key: 'fm',
        option: {
          type: 'object-body',
          formatters: [
            {
              findFrom: '',
              string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
              dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
            },
          ],
        },
      },
    ]);

    expect(r01).toMatchObject(['19/Jan/2023', '20/Jan/2023']);
  });

  test('formatter - exception', () => {
    const r01 = getBodyInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'object-body',
          formatters: {
            findFrom: '',
            string: () => {
              throw new Error('formatter exception');
            },
          },
        },
      },
    ]);

    expect(r01).toEqual('2023-01-20');
  });

  test('array', () => {
    const r01 = getBodyInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'object-body',
        },
      },
    ]);

    expect(r01).toMatchObject(['ironman', 'captain']);
  });

  test('plain value', () => {
    const r01 = getBodyInfo({ hero: 'ironman' }, [
      {
        key: 'hero',
        option: {
          type: 'object-body',
        },
      },
    ]);

    expect(r01).toEqual('ironman');
  });

  test('null value', () => {
    const r01 = getBodyInfo({ hero: null }, [
      {
        key: 'hero',
        option: {
          type: 'object-body',
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });

  test('object value', () => {
    const r01 = getBodyInfo({ hero: { name: 'ironman' } }, [
      {
        key: 'hero',
        option: { type: 'object-body' },
      },
    ]);

    expect(r01).toMatchObject({ name: 'ironman' });
  });

  test('exception value', () => {
    try {
      const sym = Symbol('ironman');
      getBodyInfo(
        { hero: sym },
        [
          {
            key: 'hero',
            option: { type: 'object-body' },
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
        option: { type: 'object-body' },
      },
    ]);

    expect(r01).toMatchObject({});
  });
});
