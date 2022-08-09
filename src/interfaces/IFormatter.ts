/**
 * Define formatter for querystring, param, headers, body
 */
export interface IFormatter {
  // number?: (value: number) => string;

  /** function is string type convert to another string */
  string?: (value: string) => string | Date;

  /** function is JavaScript Date type convert to string */
  dateTime?: (value: Date) => string;
}
