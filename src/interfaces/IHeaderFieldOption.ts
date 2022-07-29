import IBodyHeaderCommonFieldOption from '@interfaces/IBodyHeaderCommonFieldOption';
import ICommonFieldOption from '@interfaces/ICommonFieldOption';

export default interface IHeaderFieldOption extends ICommonFieldOption, IBodyHeaderCommonFieldOption {
  /** field option discriminator */
  type: 'header';
}
