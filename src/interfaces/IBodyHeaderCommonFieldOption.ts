export interface IBodyHeaderCommonFieldOption {
  /** if you set header field more than one, sort by order value asc after merged. */
  // order?: number;

  /**
   * "key" option only working in body or header. If you want to create depth of body or header,
   * set this option dot seperated string. See below,
   *
   * @example
   * `data.test.ironman` convert to `{ data: { test: { ironman: "value here" } } }`
   */
  replaceAt?: string;
}
