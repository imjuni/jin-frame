export interface ICommonFieldOption {
  /** Do encodeURIComponent execution, this option only executed in query parameter */
  encode?: boolean;

  /** The field key name */
  key: string;
}
