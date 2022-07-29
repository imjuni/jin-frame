import ICommonFieldOption from '@interfaces/ICommonFieldOption';
import IFormatter from '@interfaces/IFormatter';

export default interface IQueryParamCommonFieldOption extends ICommonFieldOption {
  formatter?: IFormatter;

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
