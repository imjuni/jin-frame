import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface IParamFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'param';
}
