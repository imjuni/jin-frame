import type { IBodyHeaderCommonFieldOption } from '@interfaces/IBodyHeaderCommonFieldOption';
import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';

export interface IHeaderFieldOption extends ICommonFieldOption, IBodyHeaderCommonFieldOption {
  /** field option discriminator */
  type: 'header';
}
