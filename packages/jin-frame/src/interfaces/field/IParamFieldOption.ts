import type { ICommonCacheKeyExcludeOption } from '#interfaces/field/ICommonCacheKeyExcludeOption';
import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface IParamFieldOption
  extends ICommonFieldOption,
    ICommonCacheKeyExcludeOption,
    IQueryParamHeaderCommonFieldOption {
  type: 'param';
}
