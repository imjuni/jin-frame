import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import type { ICookieFieldOption } from '#interfaces/field/ICookieFieldOption';

interface IGetCachePathParams {
  key: string;
  type:
    | IQueryFieldOption['type']
    | IParamFieldOption['type']
    | IHeaderFieldOption['type']
    | IBodyFieldOption['type']
    | IObjectBodyFieldOption['type']
    | ICookieFieldOption['type'];
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
