import type { IBodyHeaderCommonFieldOption } from '@interfaces/IBodyHeaderCommonFieldOption';
import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';
import type THeaderFormatter from '@interfaces/THeaderFormatter';

export interface IHeaderFieldOption extends ICommonFieldOption, Omit<IBodyHeaderCommonFieldOption, 'key'> {
  /** field option discriminator */
  type: 'header';
}

export type THeaderFieldOption = IHeaderFieldOption & THeaderFormatter;
