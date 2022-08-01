import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';
import type { IQueryParamCommonFieldOption } from '@interfaces/IQueryParamCommonFieldOption';

export interface IQueryFieldOption extends ICommonFieldOption, IQueryParamCommonFieldOption {
  type: 'query';
}
