import type { Formatter } from '#interfaces/options/Formatter';

export type SingleBodyFormatter = {
  /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
  findFrom?: string;
} & Formatter;
