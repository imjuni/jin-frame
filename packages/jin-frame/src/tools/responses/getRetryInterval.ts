import type { IFrameInternal } from '#interfaces/options/IFrameInternal';

/**
 * @param retry retry configuration from the internal data
 * @param totalDuration The total duration(ms) of all retries since the start of the API request
 * @param eachDuration duration(ms) of a single retry attempt
 * @param retryAfterSeconds Optional Retry-After header value in seconds (takes highest priority)
 */
export function getRetryInterval(
  retry: NonNullable<IFrameInternal['retry']>,
  totalDuration: number,
  eachDuration: number,
  retryAfterSeconds?: number,
): number {
  const { getInterval, interval } = retry;

  // Priority 1: Retry-After header from server (if useRetryAfter is true)
  if (retryAfterSeconds != null) {
    return retryAfterSeconds * 1000; // Convert seconds to milliseconds
  }

  // Priority 2: Custom getInterval function
  if (getInterval != null) {
    return getInterval(retry.try, totalDuration, eachDuration);
  }

  // Priority 3: Fixed interval
  if (interval != null) {
    return interval;
  }

  // Default fallback
  return 1000;
}
