import type { ICommonFieldOption } from '@interfaces/ICommonFieldOption';
import type { IFormatter } from '@interfaces/IFormatter';

export type TSingleBodyFormatter = {
  /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
  findFrom?: string;
} & IFormatter;

export type TMultipleBodyFormatter = Array<
  {
    /** use `dot notation`(eg. data.more.birthday) to specify where the results will be stored */
    findFrom?: string;
  } & IFormatter
>;

export interface IBodyFieldOption extends ICommonFieldOption {
  type: 'body';

  /**
   * If you want to create depth or rename on field of body
   * set this option dot seperated string. See below,
   *
   * @example
   * `data.test.ironman` convert to `{ data: { test: { ironman: "value here" } } }`
   */
  replaceAt?: string;

  /**
   * formatter configuration, use convert date type or transform data shape
   *
   * `formatters` field only work when have valid input type.
   *
   * `formatters` fields operate in order of string formatter, dateTime formatter. So You can change a string to
   * JavaScript Date instance using by string formatter and a converted Date instance to string using by dateTime
   * formatter.
   *
   * @remarks
   * If you use the string formatter to change to JavaScript Date instance and then do not change to a string,
   * the formatters setting is: automatically convert to iso8601 string
   *
   * @example
   * ordered example.
   *
   * ```
   * {
   *   key: 'data.more.birthday',
   *   string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
   *   dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
   * }
   * ```
   * */
  formatters?: TSingleBodyFormatter | TMultipleBodyFormatter;
}
