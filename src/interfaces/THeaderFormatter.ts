import type { IFormatter } from '@interfaces/IFormatter';

type THeaderFormatter =
  | {
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
      /** use `plain string key`(eg. data.more.birthday) to specify where the results will be stored */
      key: string;
      formatter?: IFormatter;
    }
  | {
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
      formatters?: Array<
        {
          /** use `plain string key`(eg. data.more.birthday) to specify where the results will be stored */
          key: string;
        } & IFormatter
      >;
    };

export default THeaderFormatter;
