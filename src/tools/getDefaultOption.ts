import type { IBodyFieldOption } from '@interfaces/IBodyFieldOption';
import type { THeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import type { IParamFieldOption } from '@interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '@interfaces/IQueryFieldOption';
import { Except } from 'type-fest';

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
  if (option === undefined || option === null) {
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

export function getDefaultHeaderFieldOption(
  option?: Partial<THeaderFieldOption> | Omit<Partial<THeaderFieldOption>, 'type'>,
): THeaderFieldOption {
  if (option === undefined || option === null) {
    return {
      type: 'header',
      encode: true,
    };
  }

  if ('formatter' in option) {
    return {
      type: 'header',
      formatter: option?.formatter ?? undefined,
      key: option?.key ?? undefined,
      encode: option?.encode ?? true,
    };
  }

  if ('formatters' in option) {
    return {
      type: 'header',
      formatters: option?.formatters ?? undefined,
      encode: option?.encode ?? true,
    };
  }

  return {
    type: 'header',
    encode: true,
  };
}
