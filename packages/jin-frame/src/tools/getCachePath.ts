import type { BodyFieldOption } from '#interfaces/field/body/BodyFieldOption';
import type { ObjectBodyFieldOption } from '#interfaces/field/body/ObjectBodyFieldOption';
import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';
import type { ParamFieldOption } from '#interfaces/field/ParamFieldOption';
import type { QueryFieldOption } from '#interfaces/field/QueryFieldOption';
import type { CookieFieldOption } from '#interfaces/field/CookieFieldOption';

interface IGetCachePathParams {
  key: string;
  type:
    | QueryFieldOption['type']
    | ParamFieldOption['type']
    | HeaderFieldOption['type']
    | BodyFieldOption['type']
    | ObjectBodyFieldOption['type']
    | CookieFieldOption['type'];
  replaceAt?: string;
}

export function getCachePath(params: IGetCachePathParams): string {
  if (params.type === 'object-body') {
    const cachePath = 'body';
    return cachePath;
  }

  const key = params.replaceAt ?? params.key;
  const cachePath = [params.type, key].join('.');
  return cachePath;
}
