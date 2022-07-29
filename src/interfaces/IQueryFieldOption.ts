import ICommonFieldOption from '@interfaces/ICommonFieldOption';
import IQueryParamCommonFieldOption from '@interfaces/IQueryParamCommonFieldOption';

export default interface IQueryFieldOption extends ICommonFieldOption, IQueryParamCommonFieldOption {
  type: 'query';
}
