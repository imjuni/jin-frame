import IBodyHeaderCommonFieldOption from '@interfaces/IBodyHeaderCommonFieldOption';
import ICommonFieldOption from '@interfaces/ICommonFieldOption';

export default interface IBodyFieldOption extends ICommonFieldOption, IBodyHeaderCommonFieldOption {
  type: 'body';
}
