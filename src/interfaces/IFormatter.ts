/**
 * Define formatter for querystring, param, headers, body
 */
export interface IFormatter {
  /**
   * order of formatter apply
   *
   * @default ['number', 'string', 'dateTime']
   *  */
  order?: ('string' | 'number' | 'dateTime')[];

  /**
   * 오류가 발생했을 때 값을 버립니다. false를 전달하면 exception이 발생합니다
   */
  ignoreError?: boolean;

  /** function is number type convert to another number, string, Date */
  number?: (value: number) => number | Date | string;

  /** function is string type convert to another string, Date */
  string?: (value: string) => string | Date;

  /** function is JavaScript Date type convert to string */
  dateTime?: (value: Date) => string;
}
