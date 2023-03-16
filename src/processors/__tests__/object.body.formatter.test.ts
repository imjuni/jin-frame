/* eslint-disable max-classes-per-file, no-console */
import { processObjectBodyFormatters } from '#processors/processObjectBodyFormatters';
import { format } from 'date-fns';
import 'jest';

describe('processObjectBodyFormatters', () => {
  test('primitive', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: 'ironman' },
      { key: 'hero', option: { type: 'object-body' } },
      { string: (val) => `avengers:${val}`, findFrom: '' },
    );

    expect(r01).toEqual('avengers:ironman');
  });

  test('primitive - date', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: new Date(2023, 0, 20) },
      { key: 'hero', option: { type: 'object-body' } },
      { dateTime: (d) => format(d, 'dd/MMM/yyyy'), findFrom: '' },
    );

    expect(r01).toEqual('20/Jan/2023');
  });

  test('array - formatter', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: ['ironman', 'captain', 'hulk'] },
      { key: 'hero', option: { type: 'object-body' } },
      { string: (val) => `avengers:${val}`, findFrom: '' },
    );

    expect(r01).toEqual(['avengers:ironman', 'avengers:captain', 'avengers:hulk']);
  });

  test('array - formatter exception', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: ['ironman', 'captain', 'hulk'] },
      { key: 'hero', option: { type: 'object-body' } },
      {
        string: () => {
          throw new Error('formatter exception');
        },
        findFrom: '',
      },
    );

    expect(r01).toEqual(['ironman', 'captain', 'hulk']);
  });

  test('array - invalid value', () => {
    const sym = Symbol('ironman');
    const r01 = processObjectBodyFormatters(
      false,
      { hero: [sym, 'ironman', 'captain', 'hulk'] },
      { key: 'hero', option: { type: 'object-body' } },
      {
        string: () => {
          throw new Error('formatter exception');
        },
        findFrom: '',
      },
    );

    expect(r01).toEqual([sym, 'ironman', 'captain', 'hulk']);
  });

  test('array - by object - formatter', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: [{ name: 'ironman' }, { name: 'captain' }, { name: 'hulk' }] },
      { key: 'hero', option: { type: 'object-body' } },
      { string: (val) => `avengers:${val}`, findFrom: 'name' },
    );

    expect(r01).toMatchObject([{ name: 'avengers:ironman' }, { name: 'avengers:captain' }, { name: 'avengers:hulk' }]);
  });

  test('object - formatter', () => {
    const r01 = processObjectBodyFormatters(
      true,
      { hero: { name: 'ironman', real: 'Tony Stark' } },
      { key: 'hero', option: { type: 'object-body' } },
      [{ string: (val) => `avengers:${val}`, findFrom: 'name' }],
    );

    expect(r01).toEqual({ name: 'avengers:ironman', real: 'Tony Stark' });
  });

  test('object - formatter - invalid field', () => {
    const sym = Symbol('ironman');
    const r01 = processObjectBodyFormatters(
      true,
      { hero: { name: 'ironman', real: 'Tony Stark', invalid: [sym] } },
      { key: 'hero', option: { type: 'object-body' } },
      [{ string: (val) => `avengers:${val}`, findFrom: 'invalid' }],
    );

    expect(r01).toEqual({ name: 'ironman', real: 'Tony Stark', invalid: [sym] });
  });

  test('object - invalid object field', () => {
    const sym = Symbol('RDJ');
    const r01 = processObjectBodyFormatters(
      false,
      { hero: { name: 'ironman', real: 'Tony Stark', sym } },
      { key: 'hero', option: { type: 'object-body' } },
      [{ string: (val) => `avengers:${val}`, findFrom: 'sym' }],
    );

    expect(r01).toMatchObject({ name: 'ironman', real: 'Tony Stark', sym });
  });

  test('object - formatter exception', () => {
    const r01 = processObjectBodyFormatters(
      false,
      { hero: { name: 'ironman', real: 'Tony Stark' } },
      { key: 'hero', option: { type: 'object-body' } },
      [
        {
          string: () => {
            throw new Error('formatter exception');
          },
          findFrom: 'name',
        },
      ],
    );

    expect(r01).toMatchObject({ name: 'ironman', real: 'Tony Stark' });
  });

  test('object - invalid value', () => {
    const sym = Symbol('ironman');
    const r01 = processObjectBodyFormatters(false, { hero: sym }, { key: 'hero', option: { type: 'object-body' } }, []);

    expect(r01).toEqual(sym);
  });

  test('object - date', () => {
    const r01 = processObjectBodyFormatters(
      false,
      { hero: new Date(1970, 4, 29) },
      { key: 'hero', option: { type: 'object-body' } },
      [
        {
          dateTime: (dt) => format(dt, 'dd/MMM/yyyy'),
          findFrom: '',
        },
      ],
    );

    expect(r01).toEqual('29/May/1970');
  });

  test('object - date - exception', () => {
    const r01 = processObjectBodyFormatters(
      false,
      { hero: new Date(1970, 4, 29) },
      { key: 'hero', option: { type: 'object-body' } },
      [
        {
          dateTime: () => {
            throw new Error('error test');
          },
          findFrom: '',
        },
      ],
    );

    expect(r01).toEqual(new Date(1970, 4, 29));
  });
});
