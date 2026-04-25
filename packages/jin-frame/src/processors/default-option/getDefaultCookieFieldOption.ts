import type { ICookieFieldOption } from '#interfaces/field/ICookieFieldOption';

export function getDefaultCookieFieldOption(
  option?: Partial<ICookieFieldOption> | Omit<Partial<ICookieFieldOption>, 'type'>,
): ICookieFieldOption {
  return {
    key: '',
    type: 'cookie',
    cacheKeyExclude: option?.cacheKeyExclude ?? false,
    bit: {
      enable: option?.bit?.enable ?? false,
      withZero: option?.bit?.withZero ?? false,
    },
    formatters: option?.formatters ?? undefined,
    replaceAt: option?.replaceAt ?? undefined,
    comma: option?.comma ?? false,
    encode: option?.encode ?? false,
  };
}
