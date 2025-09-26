import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';

export function getDefaultParamFieldOption(
  option?: Partial<IParamFieldOption> | Omit<Partial<IParamFieldOption>, 'type'>,
): IParamFieldOption {
  return {
    key: '',
    type: 'param',
    cacheKeyExclude: option?.cacheKeyExclude ?? false,
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
