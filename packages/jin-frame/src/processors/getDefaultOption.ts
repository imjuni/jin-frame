import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import type { Except } from 'type-fest';

export function getDefaultQueryFieldOption(
  option?: Partial<IQueryFieldOption> | Omit<Partial<IQueryFieldOption>, 'type'>,
): IQueryFieldOption {
  return {
    key: '',
    type: 'query',
    formatters: option?.formatters ?? undefined,
    comma: option?.comma ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    keyFormat: option?.keyFormat,
    replaceAt: option?.replaceAt,
    encode: option?.encode ?? true,
  };
}

export function getDefaultParamFieldOption(
  option?: Partial<IParamFieldOption> | Omit<Partial<IParamFieldOption>, 'type'>,
): IParamFieldOption {
  return {
    key: '',
    type: 'param',
    formatters: option?.formatters ?? undefined,
    comma: option?.comma ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    replaceAt: option?.replaceAt,
    encode: option?.encode ?? true,
  };
}

export function getDefaultBodyFieldOption(
  option?: Partial<IBodyFieldOption> | Except<Partial<IBodyFieldOption>, 'type'>,
): IBodyFieldOption {
  if (option == null) {
    return {
      key: '',
      type: 'body',
      replaceAt: undefined,
      encode: true,
    };
  }

  if ('formatters' in option) {
    return {
      key: '',
      type: 'body',
      formatters: option.formatters ?? undefined,
      replaceAt: option.replaceAt ?? undefined,
      encode: option.encode ?? true,
    };
  }

  return {
    key: '',
    type: 'body',
    replaceAt: option.replaceAt ?? undefined,
    encode: option.encode ?? true,
  };
}

export function getDefaultObjectBodyFieldOption(
  option?: Partial<IObjectBodyFieldOption> | Except<Partial<IObjectBodyFieldOption>, 'type'>,
): IObjectBodyFieldOption {
  if (option == null) {
    return {
      key: '',
      type: 'object-body',
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    };
  }

  if ('formatters' in option) {
    return {
      key: '',
      type: 'object-body',
      formatters: option.formatters ?? undefined,
      encode: option.encode ?? true,
      order: option.order ?? Number.MAX_SAFE_INTEGER,
    };
  }

  return {
    key: '',
    type: 'object-body',
    encode: option.encode ?? true,
    order: option.order ?? Number.MAX_SAFE_INTEGER,
  };
}

export function getDefaultHeaderFieldOption(
  option?: Partial<IHeaderFieldOption> | Omit<Partial<IHeaderFieldOption>, 'type'>,
): IHeaderFieldOption {
  if (option == null) {
    return {
      key: '',
      type: 'header',
      bit: { enable: false, withZero: false },
      encode: true,
      comma: false,
    };
  }

  if ('formatters' in option) {
    return {
      key: '',
      type: 'header',
      bit: { enable: false, withZero: false },
      formatters: option.formatters ?? undefined,
      replaceAt: option.replaceAt ?? undefined,
      comma: option.comma ?? false,
      encode: option.encode ?? true,
    };
  }

  return {
    key: '',
    type: 'header',
    replaceAt: option.replaceAt ?? undefined,
    bit: { enable: false, withZero: false },
    comma: option.comma ?? false,
    encode: option.encode ?? true,
  };
}
