/**
 * Define formatter for querystring, param, headers, body
 */
export interface Formatter {
  /**
   * order of formatter apply
   *
   * @default ['number', 'string', 'dateTime']
   *  */
  order?: ('string' | 'number' | 'dateTime')[];

  /**
   * When true, silently discards the value on formatter error.
   * When false, throws an exception on error.
   */
  ignoreError?: boolean;

  /** function is number type convert to another number, string, Date */
  number?: (value: number) => number | Date | string;

  /** function is string type convert to another string, Date */
  string?: (value: string) => string | Date;

  /** function is JavaScript Date type convert to string */
  dateTime?: (value: Date) => string;
}
