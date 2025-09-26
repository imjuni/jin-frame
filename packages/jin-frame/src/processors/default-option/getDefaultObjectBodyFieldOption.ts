import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { Except } from 'type-fest';

export function getDefaultObjectBodyFieldOption(
  option?: Partial<IObjectBodyFieldOption> | Except<Partial<IObjectBodyFieldOption>, 'type'>,
): IObjectBodyFieldOption {
  return {
    key: '',
    type: 'object-body',
    cacheKeyExcludePath: option?.cacheKeyExcludePath ?? undefined,
    formatters: option?.formatters ?? undefined,
    encode: option?.encode ?? true,
    order: option?.order ?? Number.MAX_SAFE_INTEGER,
  };
}
