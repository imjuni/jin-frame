import type { IFormatter } from '#interfaces/IFormatter';

export interface IQueryParamCommonFieldOption {
  formatter?: IFormatter;

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
}
