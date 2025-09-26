import type { ICommonCacheKeyExcludeOption } from '#interfaces/field/ICommonCacheKeyExcludeOption';
import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface IQueryFieldOption
  extends ICommonFieldOption,
    ICommonCacheKeyExcludeOption,
    IQueryParamHeaderCommonFieldOption {
  type: 'query';

  /**
   * Querystring Array key formatting
   *
   * - brackets
   *  - a[]=x&a[]=y
   * - indices
   *  - a[0]=x&a[1]=y
   * - one-indices
   *  - a[1]=x&a[2]=y
   */
  keyFormat?: 'brackets' | 'indices' | 'one-indices';
}
