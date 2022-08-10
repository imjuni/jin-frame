/**
 * Define formatter for querystring, param, headers, body
 */
export interface IFormatter {
  /**
   * order of formatter apply
   *
   * @default ['number', 'string', 'dateTime']
   *  */
  order?: Array<'string' | 'number' | 'dateTime'>;

  /** function is number type convert to another number, string, Date */
  number?: (value: number) => number | Date | string;

  /** function is string type convert to another string, Date */
  string?: (value: string) => string | Date;

  /** function is JavaScript Date type convert to string */
  dateTime?: (value: Date) => string;
}
