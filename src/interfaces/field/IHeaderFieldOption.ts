import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface IHeaderFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'header';
}
