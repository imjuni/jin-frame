import type { CommonCacheKeyExcludeOption } from '#interfaces/field/CommonCacheKeyExcludeOption';
import type { CommonFieldOption } from '#interfaces/field/CommonFieldOption';
import type { QueryParamHeaderCommonFieldOption } from '#interfaces/field/QueryParamHeaderCommonFieldOption';

export interface QueryFieldOption
  extends CommonFieldOption,
    CommonCacheKeyExcludeOption,
    QueryParamHeaderCommonFieldOption {
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
