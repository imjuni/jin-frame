import { getBodyInfo } from '#processors/getBodyInfo';
import { format, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('getBodyInfo', () => {
  it('formatter', () => {
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

  it('formatter - array', () => {
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

  it('formatter - exception', () => {
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

  it('array', () => {
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

  it('plain value', () => {
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

  it('null value', () => {
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

  it('object value', () => {
    const r01 = getBodyInfo({ hero: { name: 'ironman' } }, [
      {
        key: 'hero',
        option: { type: 'body' },
      },
    ]);

    expect(r01).toMatchObject({ hero: { name: 'ironman' } });
  });

  it('exception value', () => {
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

  it('invalid value', () => {
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
