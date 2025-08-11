import type { ICommonFieldOption } from '#interfaces/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/IQueryParamHeaderCommonFieldOption';

export interface IParamFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'param';
}
