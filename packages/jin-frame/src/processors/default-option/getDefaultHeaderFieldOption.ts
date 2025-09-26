import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';

export function getDefaultHeaderFieldOption(
  option?: Partial<IHeaderFieldOption> | Omit<Partial<IHeaderFieldOption>, 'type'>,
): IHeaderFieldOption {
  return {
    key: '',
    type: 'header',
    cacheKeyExclude: option?.cacheKeyExclude ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    formatters: option?.formatters ?? undefined,
    replaceAt: option?.replaceAt ?? undefined,
    comma: option?.comma ?? false,
    encode: option?.encode ?? true,
  };
}
