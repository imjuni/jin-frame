import { getHeaderInfo } from '#processors/getHeaderInfo';
import { format, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('getHeaderInfo', () => {
  it('formatter', () => {
    const r01 = getHeaderInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'header',
          comma: false,
          formatters: {
            string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
            dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          },
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '20/Jan/2023' });
  });

  it('formatter - array', () => {
    const r01 = getHeaderInfo({ fm: ['2023-01-19', '2023-01-20'] }, [
      {
        key: 'fm',
        option: {
          type: 'header',
          comma: true,
          formatters: [
            {
              string: (v) => parse(v, 'yyyy-MM-dd', new Date()),
              dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
            },
          ],
        },
      },
    ]);

    expect(r01).toMatchObject({ fm: '19/Jan/2023,20/Jan/2023' });
  });

  it('formatter - exception', () => {
    const r01 = getHeaderInfo({ fm: '2023-01-20' }, [
      {
        key: 'fm',
        option: {
          type: 'header',
          comma: false,
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

  it('array - comma', () => {
    const r01 = getHeaderInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'header',
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: 'ironman,captain' });
  });

  it('array', () => {
    const r01 = getHeaderInfo({ heroes: ['ironman', 'captain'] }, [
      {
        key: 'heroes',
        option: {
          type: 'header',
        },
      },
    ]);

    expect(r01).toMatchObject({ heroes: '["ironman","captain"]' });
  });

  it('plain value', () => {
    const r01 = getHeaderInfo({ hero: 'ironman' }, [
      {
        key: 'hero',
        option: {
          type: 'header',
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({ hero: 'ironman' });
  });

  it('null value', () => {
    const r01 = getHeaderInfo({ hero: null }, [
      {
        key: 'hero',
        option: {
          type: 'header',
          comma: true,
        },
      },
    ]);

    expect(r01).toMatchObject({});
  });

  it('object value', () => {
    const r01 = getHeaderInfo({ hero: { name: 'ironman' } }, [
      {
        key: 'hero',
        option: { type: 'header' },
      },
    ]);

    expect(r01).toMatchObject({ hero: '{"name":"ironman"}' });
  });

  it('exception value', () => {
    try {
      const sym = Symbol('ironman');
      getHeaderInfo(
        { hero: sym },
        [
          {
            key: 'hero',
            option: { type: 'header' },
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
    const r01 = getHeaderInfo({ hero: sym }, [
      {
        key: 'hero',
        option: { type: 'header' },
      },
    ]);

    expect(r01).toMatchObject({});
  });
});
