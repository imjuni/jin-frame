import type { ICommonFieldOption } from '#interfaces/ICommonFieldOption';
import type { IFormatter } from '#interfaces/IFormatter';

export interface IHeaderFieldOption extends ICommonFieldOption {
  /** field option discriminator */
  type: 'header';

  /**
   * "replaceAt" option only working in body or header. If you want to create depth of body or header,
   * set this option dot seperated string. See below,
   *
   * @example
   * `data.test.ironman` convert to `{ data: { test: { ironman: "value here" } } }`
   */
  replaceAt?: string;

  /**
   * "comma" option only working array type variable. If you want to process array parameter of headers
   * using by comma seperated string, set this option
   *
   * Comma seperated array parameter on header
   */
  comma?: boolean;

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
   * header field don't need a findFrom. HTTP protocol header not treat complex type object and array.
   *
   * @url https://developer.mozilla.org/en-US/docs/Web/API/Headers
   *
   * @example
   * ordered example.
   *
   * ```
   * {
   *   string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
   *   dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
   * }
   * ```
   * */
  formatters?: IFormatter | IFormatter[];
}
