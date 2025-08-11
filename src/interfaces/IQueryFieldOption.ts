import type { ICommonFieldOption } from '#interfaces/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/IQueryParamHeaderCommonFieldOption';

export interface IQueryFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'query';
}
