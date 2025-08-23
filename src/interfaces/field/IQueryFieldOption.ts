import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { IQueryParamHeaderCommonFieldOption } from '#interfaces/field/IQueryParamHeaderCommonFieldOption';

export interface IQueryFieldOption extends ICommonFieldOption, IQueryParamHeaderCommonFieldOption {
  type: 'query';
}
