import type { IBodyHeaderCommonFieldOption } from '@interfaces/IBodyHeaderCommonFieldOption';
import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';

export interface IBodyFieldOption extends ICommonFieldOption, IBodyHeaderCommonFieldOption {
  type: 'body';
}
