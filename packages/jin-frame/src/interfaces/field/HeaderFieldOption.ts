import type { CommonCacheKeyExcludeOption } from '#interfaces/field/CommonCacheKeyExcludeOption';
import type { CommonFieldOption } from '#interfaces/field/CommonFieldOption';
import type { QueryParamHeaderCommonFieldOption } from '#interfaces/field/QueryParamHeaderCommonFieldOption';

export interface HeaderFieldOption
  extends CommonFieldOption,
    CommonCacheKeyExcludeOption,
    QueryParamHeaderCommonFieldOption {
  type: 'header';
}
