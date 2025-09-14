import type { IFrameInternal } from '#interfaces/options/IFrameInternal';

/**
 * @param retry retry configuration from the internal data
 * @param totalDuration The total duration(ms) of all retries since the start of the API request
 * @param eachDuration duration(ms) of a single retry attempt
 */
export function getRetryInterval(
  retry: NonNullable<IFrameInternal['retry']>,
  totalDuration: number,
  eachDuration: number,
): number {
  const { getInterval, interval } = retry;

  if (getInterval != null) {
    return getInterval(retry.try, totalDuration, eachDuration);
  }

  if (interval != null) {
    return interval;
  }

  return 1000;
}
