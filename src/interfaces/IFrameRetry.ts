export interface IFrameRetry {
  /** retry를 최대 몇 번까지 할 것인지 설정 */
  max: number;

  /** retry를 할 때 간격(ms), retry 시도 횟수에 따라 간격을 더 길게 하고 싶을 때 사용 */
  getInterval?: (retry: number) => number;

  /** retry를 할 때 간격(ms), retry 간격을 일정하게 하고 싶을 때 사용, getInterval이 설정된 경우 무시 됨 */
  interval?: number;
}
