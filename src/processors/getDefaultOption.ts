import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';
import type { Except } from 'type-fest';

export function getDefaultQueryFieldOption(
  option?: Partial<IQueryFieldOption> | Omit<Partial<IQueryFieldOption>, 'type'>,
): IQueryFieldOption {
  return {
    type: 'query',
    formatter: option?.formatter ?? undefined,
    comma: option?.comma ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    encode: option?.encode ?? true,
  };
}

export function getDefaultParamFieldOption(
  option?: Partial<IParamFieldOption> | Omit<Partial<IParamFieldOption>, 'type'>,
): IParamFieldOption {
  return {
    type: 'param',
    formatter: option?.formatter ?? undefined,
    comma: option?.comma ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    encode: option?.encode ?? true,
  };
}

export function getDefaultBodyFieldOption(
  option?: Partial<IBodyFieldOption> | Except<Partial<IBodyFieldOption>, 'type'>,
): IBodyFieldOption {
  if (option == null) {
    return {
      type: 'body',
      replaceAt: undefined,
      encode: true,
    };
  }

  if ('formatters' in option) {
    return {
      type: 'body',
      formatters: option?.formatters ?? undefined,
      replaceAt: option?.replaceAt ?? undefined,
      encode: option?.encode ?? true,
    };
  }

  return {
    type: 'body',
    replaceAt: option?.replaceAt ?? undefined,
    encode: option?.encode ?? true,
  };
}

export function getDefaultObjectBodyFieldOption(
  option?: Partial<IObjectBodyFieldOption> | Except<Partial<IObjectBodyFieldOption>, 'type'>,
): IObjectBodyFieldOption {
  if (option == null) {
    return {
      type: 'object-body',
      encode: true,
      order: Number.MAX_SAFE_INTEGER,
    };
  }

  if ('formatters' in option) {
    return {
      type: 'object-body',
      formatters: option?.formatters ?? undefined,
      encode: option?.encode ?? true,
      order: option?.order ?? Number.MAX_SAFE_INTEGER,
    };
  }

  return {
    type: 'object-body',
    encode: option?.encode ?? true,
    order: option?.order ?? Number.MAX_SAFE_INTEGER,
  };
}

export function getDefaultHeaderFieldOption(
  option?: Partial<IHeaderFieldOption> | Omit<Partial<IHeaderFieldOption>, 'type'>,
): IHeaderFieldOption {
  if (option === undefined || option === null) {
    return {
      type: 'header',
      encode: true,
      comma: false,
    };
  }

  if ('formatters' in option) {
    return {
      type: 'header',
      formatters: option?.formatters ?? undefined,
      replaceAt: option?.replaceAt ?? undefined,
      comma: option.comma ?? false,
      encode: option?.encode ?? true,
    };
  }

  return {
    type: 'header',
    replaceAt: option?.replaceAt ?? undefined,
    comma: option.comma ?? false,
    encode: option?.encode ?? true,
  };
}
