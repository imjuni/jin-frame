import type { IFormatter } from '#interfaces/options/IFormatter';

export type TSingleBodyFormatter = {
  /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
  findFrom?: string;
} & IFormatter;
