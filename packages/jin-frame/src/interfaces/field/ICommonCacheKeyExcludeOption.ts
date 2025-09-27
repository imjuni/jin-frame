export interface ICommonCacheKeyExcludeOption {
  /**
   * When this option is set to true, the field will be excluded from cache key generation.
   * Including values that always change (like UUIDs) in the cache reduces cache efficiency.
   * Enable this option to exclude such fields from caching.
   */
  cacheKeyExclude: boolean;
}
