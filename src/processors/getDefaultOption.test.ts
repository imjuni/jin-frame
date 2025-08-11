import type { TSingleBodyFormatter } from '#interfaces/body/TSingleBodyFormatter';
import type { IFormatter } from '#interfaces/IFormatter';
import {
  getDefaultBodyFieldOption,
  getDefaultHeaderFieldOption,
  getDefaultObjectBodyFieldOption,
  getDefaultParamFieldOption,
  getDefaultQueryFieldOption,
} from '#processors/getDefaultOption';
import { describe, expect, it } from 'vitest';

describe('getDefaultQueryFieldOption', () => {
  it('default', () => {
    const option = getDefaultQueryFieldOption();

    expect(option).toEqual({
      type: 'query',
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultQueryFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'query',
      formatters: f,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('comma', () => {
    const r01 = getDefaultQueryFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'query',
      formatters: undefined,
      comma: true,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('comma', () => {
    const r01 = getDefaultQueryFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'query',
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: false,
    });
  });

  it('bit', () => {
    const r01 = getDefaultQueryFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'query',
      formatters: undefined,
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
      formatters: undefined,
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
  it('default', () => {
    const option = getDefaultParamFieldOption();

    expect(option).toEqual({
      type: 'param',
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultParamFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'param',
      formatters: f,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('comma', () => {
    const r01 = getDefaultParamFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'param',
      formatters: undefined,
      comma: true,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: true,
    });
  });

  it('comma', () => {
    const r01 = getDefaultParamFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'param',
      formatters: undefined,
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
      encode: false,
    });
  });

  it('bit', () => {
    const r01 = getDefaultParamFieldOption({ bit: { enable: true, withZero: false } });
    expect(r01).toMatchObject({
      type: 'param',
      formatters: undefined,
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
      formatters: undefined,
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
  it('default', () => {
    const option = getDefaultBodyFieldOption();

    expect(option).toEqual({
      type: 'body',
      replaceAt: undefined,
      encode: true,
    });
  });

  it('formatter', () => {
    const f: IFormatter = { string: (s) => `f:${s}` };
    const option = getDefaultBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'body',
      formatters: f,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('formatter - undefined', () => {
    const option = getDefaultBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'body',
      formatters: undefined,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('replaceAt', () => {
    const r01 = getDefaultBodyFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  it('encode', () => {
    const r01 = getDefaultBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'body',
      replaceAt: undefined,
      encode: false,
    });
  });
});

describe('getDefaultObjectBodyFieldOption', () => {
  it('default', () => {
    const option = getDefaultObjectBodyFieldOption();

    expect(option).toEqual({
      type: 'object-body',
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('formatter', () => {
    const f: TSingleBodyFormatter = { findFrom: 'f', string: (s) => `f:${s}` };
    const option = getDefaultObjectBodyFieldOption({ formatters: f });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: f,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('formatter - undefined', () => {
    const option = getDefaultObjectBodyFieldOption({ formatters: undefined });

    expect(option).toMatchObject({
      type: 'object-body',
      formatters: undefined,
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    });
  });

  it('replaceAt', () => {
    const r01 = getDefaultObjectBodyFieldOption({ order: 1 });
    expect(r01).toMatchObject({
      type: 'object-body',
      encode: true,
      order: 1,
    });
  });

  it('encode', () => {
    const r01 = getDefaultObjectBodyFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'object-body',
      order: Number.MAX_SAFE_INTEGER,
      encode: false,
    });
  });
});

describe('getDefaultHeaderFieldOption', () => {
  it('default', () => {
    const option = getDefaultHeaderFieldOption();

    expect(option).toEqual({
      type: 'header',
      bit: {
        enable: false,
        withZero: false,
      },
      comma: false,
      encode: true,
    });
  });

  it('formatter', () => {
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

  it('replaceAt', () => {
    const r01 = getDefaultHeaderFieldOption({ replaceAt: 'replace-need' });
    expect(r01).toMatchObject({
      type: 'header',
      comma: false,
      replaceAt: 'replace-need',
      encode: true,
    });
  });

  it('comma', () => {
    const r01 = getDefaultHeaderFieldOption({ comma: true });
    expect(r01).toMatchObject({
      type: 'header',
      comma: true,
      replaceAt: undefined,
      encode: true,
    });
  });

  it('encode', () => {
    const r01 = getDefaultHeaderFieldOption({ encode: false });
    expect(r01).toMatchObject({
      type: 'header',
      comma: false,
      replaceAt: undefined,
      encode: false,
    });
  });
});

it('formatter - undefined', () => {
  const option = getDefaultHeaderFieldOption({ formatters: undefined });

  expect(option).toMatchObject({
    type: 'header',
    formatters: undefined,
    comma: false,
    replaceAt: undefined,
    encode: true,
  });
});
