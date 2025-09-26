import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import type { ICommonFieldOption } from '#interfaces/field/ICommonFieldOption';
import type { ICommonCacheKeyExcludePathOption } from '#interfaces/field/ICommonCacheKeyExcludePathOption';

export interface IObjectBodyFieldOption extends ICommonFieldOption, ICommonCacheKeyExcludePathOption {
  type: 'object-body';

  /**
   * merge order of object-body. Sorted in ascending order. Objects with fast numbers are overwritten by
   * object with slow number.
   *
   * @default Number.MAX_SAFE_INTEGER
   * */
  order: number;

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
   *   findFrom: 'data.more.birthday',
   *   string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
   *   dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
   * }
   * ```
   * */
  formatters?: TSingleBodyFormatter | TSingleBodyFormatter[];
}
