import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';
import type { IQueryParamCommonFieldOption } from '@interfaces/IQueryParamCommonFieldOption';

export interface IParamFieldOption extends ICommonFieldOption, IQueryParamCommonFieldOption {
  type: 'param';
}
