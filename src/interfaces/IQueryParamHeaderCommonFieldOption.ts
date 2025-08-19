import type { IFormatter } from '#interfaces/IFormatter';

export interface IQueryParamHeaderCommonFieldOption {
  /**
   * If you want to create depth or rename on field of body
   * set this option dot seperated string. See below,
   *
   * @example
   * `data.test.ironman` convert to `{ "data.test.ironman": "value here" }`
   */
  replaceAt?: string;

  /**
   * "comma" option only working querystring. If you want to process array parameter of querystring
   * using by comma seperated string, set this option
   *
   * Comma seperated array parameter on querystring
   */
  comma: boolean;

  bit: {
    /** enable bitwised operator using by array */
    enable: boolean;

    /** If this configuration set enable, bitwised operation result are zero after submit zero value */
    withZero: boolean;
  };

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
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
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
