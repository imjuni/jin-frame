export interface ICommonCacheKeyExcludeOption {
  /**
   * 이 옵션 값이 true로 설정되는 경우 cache key를 생성할 때 제외합니다.
   * uuid와 같이 항상 변경되는 값을 캐시에 포함할 경우 캐시 효율이 저하됩니다.
   * 이 옵션을 활성화 하여 제외해주세요.
   * */
  cacheKeyExclude: boolean;
}
