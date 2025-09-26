import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { Except } from 'type-fest';

export function getDefaultBodyFieldOption(
  option?: Partial<IBodyFieldOption> | Except<Partial<IBodyFieldOption>, 'type'>,
): IBodyFieldOption {
  return {
    key: '',
    type: 'body',
    cacheKeyExcludePath: option?.cacheKeyExcludePath ?? undefined,
    replaceAt: option?.replaceAt ?? undefined,
    formatters: option?.formatters ?? undefined,
    encode: option?.encode ?? true,
  };
}
