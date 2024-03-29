import { processBodyFormatters } from '#processors/processBodyFormatters';
import { describe, expect, it } from 'vitest';

describe('processBodyFormatters', () => {
  it('replaceAt', () => {
    const dts = processBodyFormatters(
      true,
      { name: 'ironman' },
      { key: 'name', option: { type: 'body', replaceAt: 'hero' } },
      [],
    );

    expect(dts).toEqual({ hero: 'ironman' });
  });

  it('primitive - formatter', () => {
    const r01 = processBodyFormatters(true, { name: 'ironman' }, { key: 'name', option: { type: 'body' } }, [
      { string: (val) => `avengers:${val}` },
    ]);

    expect(r01).toEqual({ name: 'avengers:ironman' });
  });

  it('primitive - exception', () => {
    const r01 = processBodyFormatters(false, { name: 'ironman' }, { key: 'name', option: { type: 'body' } }, [
      {
        string: () => {
          throw new Error('for the test');
        },
      },
    ]);

    expect(r01).toMatchObject({ name: 'ironman' });
  });

  it('array - formatter', () => {
    const r01 = processBodyFormatters(
      true,
      { names: ['ironman', 'captain', 'hulk'] },
      { key: 'names', option: { type: 'body' } },
      { string: (val) => `avengers:${val}` },
    );

    expect(r01).toEqual({ names: ['avengers:ironman', 'avengers:captain', 'avengers:hulk'] });
  });

  it('array - exception', () => {
    const sym = Symbol('ironman');
    const r01 = () =>
      processBodyFormatters(true, { names: [sym, 'captain', 'hulk'] }, { key: 'names', option: { type: 'body' } }, [
        { string: (val) => `avengers:${val}` },
      ]);

    const r02 = processBodyFormatters(
      false,
      { names: [sym, 'captain', 'hulk'] },
      { key: 'names', option: { type: 'body' } },
      [{ string: (val) => `avengers:${val}` }],
    );

    expect(r01).toThrow();
    expect(r02).toEqual({ names: [sym, 'captain', 'hulk'] });
  });

  it('object - formatter', () => {
    const r01 = processBodyFormatters(
      true,
      { hero: { name: 'ironman', real: 'Tony Stark' } },
      { key: 'hero', option: { type: 'body' } },
      [{ string: (val) => `avengers:${val}`, findFrom: 'name' }],
    );

    expect(r01).toEqual({ hero: { name: 'avengers:ironman', real: 'Tony Stark' } });
  });

  it('object - invalid formatter', () => {
    try {
      processBodyFormatters(
        true,
        { hero: { name: 'ironman', real: 'Tony Stark' } },
        { key: 'hero', option: { type: 'body' } },
        [{ string: (val) => `avengers:${val}` }],
      );
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('object - invalid field', () => {
    const sym = Symbol('RDJ');
    const r01 = processBodyFormatters(
      false,
      { hero: { name: 'ironman', real: 'Tony Stark', sym } },
      { key: 'hero', option: { type: 'body' } },
      [{ string: (val) => `avengers:${val}`, findFrom: 'sym' }],
    );

    expect(r01).toMatchObject({ hero: { name: 'ironman', real: 'Tony Stark', sym } });
  });

  it('object - formatter exception', () => {
    const r01 = processBodyFormatters(
      false,
      { hero: { name: 'ironman', real: 'Tony Stark' } },
      { key: 'hero', option: { type: 'body' } },
      [
        {
          string: () => {
            throw new Error('formatter exception');
          },
          findFrom: 'name',
        },
      ],
    );

    expect(r01).toMatchObject({ hero: { name: 'ironman', real: 'Tony Stark' } });
  });

  it('object - formatter exception', () => {
    const sym = Symbol('ironman');
    const r01 = processBodyFormatters(false, { hero: sym }, { key: 'hero', option: { type: 'body' } }, []);

    expect(r01).toMatchObject({ hero: sym });
  });
});
