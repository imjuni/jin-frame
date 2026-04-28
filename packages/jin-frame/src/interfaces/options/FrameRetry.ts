export interface FrameRetry {
  /** Maximum number of retry attempts. */
  max: number;

  /**
   * Returns the retry interval in milliseconds based on the attempt count and elapsed time.
   * Use this when you want to vary the interval per attempt (e.g. exponential backoff).
   *
   * @param retry Current retry attempt number
   * @param totalDuration Total elapsed time (ms) since the first attempt
   * @param eachDuration Duration (ms) of the most recent attempt
   */
  getInterval?: (retry: number, totalDuration: number, eachDuration: number) => number;

  /**
   * Fixed retry interval in milliseconds.
   * Ignored when `getInterval` is configured.
   */
  interval?: number;

  /**
   * When true, honours the `Retry-After` response header as the retry delay.
   * Takes precedence over `interval` and `getInterval`.
   * Defaults to true.
   */
  useRetryAfter?: boolean;
}
