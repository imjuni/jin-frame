import ICommonFieldOption from '@interfaces/ICommonFieldOption';
import IQueryParamCommonFieldOption from '@interfaces/IQueryParamCommonFieldOption';

export default interface IParamFieldOption extends ICommonFieldOption, IQueryParamCommonFieldOption {
  type: 'param';
}
