export interface IFieldOption {
  /**
   * JavaScript Date object convert to string via luxon package. dateFormat option using by that
   * convertion. It have same rule of
   * [luxon.DateTime.toFormat function](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens)
   */
  dateFormat?: string;

  /**
   * Option force.enable do copy value to body or header. If you one more field set force.enable,
   * last value setted.
   */
  force?: {
    enable: boolean;
  };

  /**
   * "key" option only working in body or header. If you want to create depth of body or header,
   * set this option dot seperated string. See below,
   *
   *
   * { key: "data.test.ironman" }
   *
   * create depth,
   *
   * {
   *    data: {
   *        test: {
   *            ironman: "value here"
   *        }
   *    }
   * }
   */
  key?: string;

  /**
   * "comma" option only working querystring. If you want to process array parameter of querystring
   * using by comma seperated string, set this option
   */
  comma?: {
    /** Comma seperated array parameter on querystring */
    enable: boolean;
  };

  bit?: {
    /** 비트 구분자를 처리한다 */
    enable: boolean;

    /** 비트 구분자를 제출할 때 0도 제출한다 */
    withZero: boolean;
  };

  /** Do encodeURIComponent execution, this option only executed in query parameter */
  encode?: boolean;
}
