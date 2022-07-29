import IBodyFieldOption from '@interfaces/IBodyFieldOption';
import IHeaderFieldOption from '@interfaces/IHeaderFieldOption';
import IParamFieldOption from '@interfaces/IParamFieldOption';
import IQueryFieldOption from '@interfaces/IQueryFieldOption';

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
  option?: Partial<IBodyFieldOption> | Omit<Partial<IBodyFieldOption>, 'type'>,
): IBodyFieldOption {
  return {
    type: 'body',
    order: option?.order,
    formatters: option?.formatters ?? undefined,
    key: option?.key ?? undefined,
    encode: option?.encode ?? true,
  };
}

export function getDefaultHeaderFieldOption(
  option?: Partial<IHeaderFieldOption> | Omit<Partial<IHeaderFieldOption>, 'type'>,
): IHeaderFieldOption {
  return {
    type: 'header',
    order: option?.order,
    formatters: option?.formatters ?? undefined,
    key: option?.key ?? undefined,
    encode: option?.encode ?? true,
  };
}
