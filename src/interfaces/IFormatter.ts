/**
 * Define formatter for querystring, param, headers, body
 */
export default interface IFormatter {
  /** function is JavaScript Date type convert to string */
  dateTime?: (value: Date) => string;

  /** function is string type convert to another string */
  string?: (value: string) => string | Date;
}
