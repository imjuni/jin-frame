import type { ICommonCacheKeyExcludeOption } from '#interfaces/field/ICommonCacheKeyExcludeOption';
import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface ICookieFieldOption
  extends ICommonFieldOption,
    ICommonCacheKeyExcludeOption,
    IQueryParamHeaderCommonFieldOption {
  type: 'cookie';
}
