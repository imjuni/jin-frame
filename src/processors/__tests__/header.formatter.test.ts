/* eslint-disable max-classes-per-file, no-console */
import { processHeaderFormatters } from '#processors/processHeaderFormatters';
import 'jest';

describe('processHeaderFormatters', () => {
  test('formatter', () => {
    const dts = processHeaderFormatters({ name: 'ironman' }, { key: 'name', option: { type: 'header' } }, [
      { string: (s) => `avengers:${s}` },
    ]);

    expect(dts).toEqual({ name: 'avengers:ironman' });
  });

  test('formatter', () => {
    const r01 = processHeaderFormatters(
      { name: ['ironman', 'captain'] },
      { key: 'name', option: { type: 'header', comma: true } },
      [{ string: (s) => `avengers:${s}` }],
    );

    const r02 = processHeaderFormatters(
      { name: ['ironman', 'captain'] },
      { key: 'name', option: { type: 'header', comma: false } },
      [{ string: (s) => `avengers:${s}` }],
    );

    expect(r01).toEqual({ name: 'avengers:ironman,avengers:captain' });
    expect(r02).toEqual({ name: '["avengers:ironman","avengers:captain"]' });
  });

  test('formatter', () => {
    const r01 = processHeaderFormatters(
      { name: ['<ironman>', 'captain'] },
      { key: 'name', option: { type: 'header', comma: true, encode: true } },
      [{ string: (s) => `avengers:${s}` }],
    );

    const r02 = processHeaderFormatters(
      { name: ['ironman', 'captain'] },
      { key: 'name', option: { type: 'header', comma: false, encode: true } },
      [{ string: (s) => `avengers:${s}` }],
    );

    const r03 = processHeaderFormatters(
      { name: ['ironman', 'captain'] },
      { key: 'name', option: { type: 'header', encode: true } },
      [{ string: (s) => `avengers:${s}` }],
    );

    expect(r01).toEqual({ name: 'avengers%3A%3Cironman%3E%2Cavengers%3Acaptain' });
    expect(r02).toEqual({ name: '%5B%22avengers%3Aironman%22%2C%22avengers%3Acaptain%22%5D' });
    expect(r03).toEqual({ name: '%5B%22avengers%3Aironman%22%2C%22avengers%3Acaptain%22%5D' });
  });

  test('invalid value', () => {
    const sym = Symbol('Symbol');
    const dts = processHeaderFormatters({ name: sym }, { key: 'name', option: { type: 'header' } }, []);

    expect(dts).toBeUndefined();
  });
});
