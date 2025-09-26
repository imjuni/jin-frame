import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';

export function getDefaultQueryFieldOption(
  option?: Partial<IQueryFieldOption> | Omit<Partial<IQueryFieldOption>, 'type'>,
): IQueryFieldOption {
  return {
    key: '',
    type: 'query',
    cacheKeyExclude: option?.cacheKeyExclude ?? false,
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
