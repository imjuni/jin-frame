import type { ParamFieldOption } from '#interfaces/field/ParamFieldOption';

export function getDefaultParamFieldOption(
  option?: Partial<ParamFieldOption> | Omit<Partial<ParamFieldOption>, 'type'>,
): ParamFieldOption {
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
