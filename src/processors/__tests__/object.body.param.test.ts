import { getBodyInfo } from '#processors/getBodyInfo';
import { format, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('getBodyInfo', () => {
  it('formatter', () => {
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

  it('sort - 1', () => {
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

  it('sort - 2', () => {
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

  it('primitive exception', () => {
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

  it('formatter - array', () => {
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

  it('formatter - exception', () => {
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

  it('array', () => {
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

  it('plain value', () => {
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

  it('null value', () => {
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

  it('object value', () => {
    const r01 = getBodyInfo({ hero: { name: 'ironman' } }, [
      {
        key: 'hero',
        option: { type: 'object-body' },
      },
    ]);

    expect(r01).toMatchObject({ name: 'ironman' });
  });

  it('exception value', () => {
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

  it('invalid value', () => {
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
