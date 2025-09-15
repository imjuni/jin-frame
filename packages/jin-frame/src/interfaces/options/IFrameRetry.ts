export interface IFrameRetry {
  /**
   * retry를 최대 몇 번까지 할 것인지 설정
   *
   * Set the maximum number of retry attempts.
   * */
  max: number;

  /**
   * retry를 할 때 간격(ms), retry 시도 횟수에 따라 간격을 더 길게 하고 싶을 때
   *
   * Specify the retry interval (in ms) and increase the interval based on the number of attempts.
   *
   * @param retry a number of the retry
   * @param totalDuration The total duration(ms) of all retries since the start of the API request
   * @param eachDuration duration(ms) of a single retry attempt
   * */
  getInterval?: (retry: number, totalDuration: number, eachDuration: number) => number;

  /**
   * retry를 할 때 간격(ms), retry 간격을 일정하게 하고 싶을 때 사용, getInterval이 설정된 경우 무시 됨
   *
   * Specify a fixed retry interval (in ms). Ignored if getInterval is configured.
   * */
  interval?: number;

  /**
   * 기본 값은 true, retry-after 헤더를 사용하고 싶을 때 사용, interval, getInterval보다 우선 동작
   *
   * Specify to use retry-after header. Prioritized over interval and getInterval.
   * */
  useRetryAfter?: boolean;
}
