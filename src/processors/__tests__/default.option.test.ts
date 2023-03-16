/* eslint-disable max-classes-per-file, no-console */
import type { TSingleObjectBodyFormatter } from '#interfaces/body/IObjectBodyFieldOption';
import type { IFormatter } from '#interfaces/IFormatter';
import {
  getDefaultBodyFieldOption,
  getDefaultHeaderFieldOption,
  getDefaultObjectBodyFieldOption,
  getDefaultParamFieldOption,
  getDefaultQueryFieldOption,
} from '#processors/getDefaultOption';
import 'jest';

describe('getDefaultQueryFieldOption', () => {
  test('default', () => {
    const option = getDefaultQueryFieldOption();

    expect(option).toEqual({
      type: 'query',
      formatter: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultQueryFieldOption({ formatter: f });

    expect(option).toMatchObject({
      type: 'query',
      formatter: f,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('comma', () => {
    const r01 = getDefaultQueryFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'query',
      formatter: undefined,
      comma: true,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('comma', () => {
    const r01 = getDefaultQueryFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'query',
      formatter: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: false,
    });
  });

  test('bit', () => {
    const r01 = getDefaultQueryFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'query',
      formatter: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: false,
      },
      encode: true,
    });

    const r02 = getDefaultQueryFieldOption({ bit: { enable: true, withZero: true } });
    expect(r02).toMatchObject({
      type: 'query',
      formatter: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: true,
      },
      encode: true,
    });
  });
});

describe('getDefaultParamFieldOption', () => {
  test('default', () => {
    const option = getDefaultParamFieldOption();

    expect(option).toEqual({
      type: 'param',
      formatter: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultParamFieldOption({ formatter: f });

    expect(option).toMatchObject({
      type: 'param',
      formatter: f,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('comma', () => {
    const r01 = getDefaultParamFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'param',
      formatter: undefined,
      comma: true,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  test('comma', () => {
    const r01 = getDefaultParamFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'param',
      formatter: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: false,
    });
  });

  test('bit', () => {
    const r01 = getDefaultParamFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'param',
      formatter: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: false,
      },
      encode: true,
    });

    const r02 = getDefaultParamFieldOption({ bit: { enable: true, withZero: true } });
    expect(r02).toMatchObject({
      type: 'param',
      formatter: undefined,
      comma: false,
      bit: {
        enable: true,
        withZero: true,
      },
      encode: true,
    });
  });
});

describe('getDefaultBodyFieldOption', () => {
  test('default', () => {
    const option = getDefaultBodyFieldOption();

    expect(option).toEqual({
      type: 'body',
      replaceAt: undefined,
      encode: true,
    });
  });

  test('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'body',
      formatters: f,
      replaceAt: undefined,
      encode: true,
    });
  });

  test('formatter - undefined', () => {
    const option = getDefaultBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'body',
      formatters: undefined,
      replaceAt: undefined,
      encode: true,
    });
  });

  test('replaceAt', () => {
    const r01 = getDefaultBodyFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  test('encode', () => {
    const r01 = getDefaultBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: undefined,
      encode: false,
    });
  });
});

describe('getDefaultObjectBodyFieldOption', () => {
  test('default', () => {
    const option = getDefaultObjectBodyFieldOption();

    expect(option).toEqual({
      type: 'object-body',
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  test('formatter', () => {
    const f: TSingleObjectBodyFormatter = { findFrom: 'f', string: (s) => `f:${s}` };
    const option = getDefaultObjectBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: f,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  test('formatter - undefined', () => {
    const option = getDefaultObjectBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: undefined,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  test('replaceAt', () => {
    const r01 = getDefaultObjectBodyFieldOption({ order: 1 });
    expect(r01).toMatchObject({
      type: 'object-body',
      encode: true,
      order: 1,
    });
  });

  test('encode', () => {
    const r01 = getDefaultObjectBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'object-body',
      order: Number.MAX_SAFE_INTEGER,
      encode: false,
    });
  });
});

describe('getDefaultHeaderFieldOption', () => {
  test('default', () => {
    const option = getDefaultHeaderFieldOption();

    expect(option).toEqual({
      type: 'header',
      comma: false,
      replaceAt: undefined,
      encode: true,
    });
  });

  test('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultHeaderFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'header',
      formatters: f,
      comma: false,
      replaceAt: undefined,
      encode: true,
    });
  });

  test('replaceAt', () => {
    const r01 = getDefaultHeaderFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'header',
      comma: false,
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  test('comma', () => {
    const r01 = getDefaultHeaderFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'header',
      comma: true,
      replaceAt: undefined,
      encode: true,
    });
  });

  test('encode', () => {
    const r01 = getDefaultHeaderFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'header',
      comma: false,
      replaceAt: undefined,
      encode: false,
    });
  });
});

test('formatter - undefined', () => {
  const option = getDefaultHeaderFieldOption({ formatters: undefined });

  expect(option).toMatchObject({
    type: 'header',
    formatters: undefined,
    comma: false,
    replaceAt: undefined,
    encode: true,
  });
});
