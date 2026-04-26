import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';

export function getDefaultHeaderFieldOption(
  option?: Partial<HeaderFieldOption> | Omit<Partial<HeaderFieldOption>, 'type'>,
): HeaderFieldOption {
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
