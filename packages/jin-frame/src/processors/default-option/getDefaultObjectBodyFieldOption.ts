import type { ObjectBodyFieldOption } from '#interfaces/field/body/ObjectBodyFieldOption';
import type { Except } from 'type-fest';

export function getDefaultObjectBodyFieldOption(
  option?: Partial<ObjectBodyFieldOption> | Except<Partial<ObjectBodyFieldOption>, 'type'>,
): ObjectBodyFieldOption {
  return {
    key: '',
    type: 'object-body',
    cacheKeyExcludePaths: option?.cacheKeyExcludePaths ?? undefined,
    formatters: option?.formatters ?? undefined,
    encode: option?.encode ?? true,
    order: option?.order ?? Number.MAX_SAFE_INTEGER,
  };
}
