import type { CookieFieldOption } from '#interfaces/field/CookieFieldOption';

export function getDefaultCookieFieldOption(
  option?: Partial<CookieFieldOption> | Omit<Partial<CookieFieldOption>, 'type'>,
): CookieFieldOption {
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
