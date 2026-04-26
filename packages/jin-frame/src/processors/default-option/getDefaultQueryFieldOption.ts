import type { QueryFieldOption } from '#interfaces/field/QueryFieldOption';

export function getDefaultQueryFieldOption(
  option?: Partial<QueryFieldOption> | Omit<Partial<QueryFieldOption>, 'type'>,
): QueryFieldOption {
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
