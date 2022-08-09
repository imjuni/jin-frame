import type { IBodyHeaderCommonFieldOption } from '@interfaces/IBodyHeaderCommonFieldOption';
import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';
import type { IFormatter } from '@interfaces/IFormatter';

export type TSingleFormatter = {
  /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
  findFrom?: string;
} & IFormatter;

export type TMultipleFormatter = Array<
  {
    /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
    findFrom?: string;
  } & IFormatter
>;

export interface IBodyFieldOption extends ICommonFieldOption, IBodyHeaderCommonFieldOption {
  type: 'body';
  formatters?: TSingleFormatter | TMultipleFormatter;
}
