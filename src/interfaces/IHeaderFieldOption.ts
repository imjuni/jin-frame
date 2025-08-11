import type { ICommonFieldOption } from '#interfaces/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/IQueryParamHeaderCommonFieldOption';

export interface IHeaderFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'header';
}
