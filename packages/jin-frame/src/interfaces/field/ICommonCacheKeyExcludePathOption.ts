export interface ICommonCacheKeyExcludePathOption {
  /**
   * When paths are provided in this option, they will be excluded from cache key generation.
   * Unlike Query, Param, and Header, Body and ObjectBody use path specifications to
   * exclude specific values.
   *
   * Including values that always change (like UUIDs) in the cache reduces cache efficiency.
   * Enable this option to exclude such fields from caching.
   */
  cacheKeyExcludePaths?: string[];
}
