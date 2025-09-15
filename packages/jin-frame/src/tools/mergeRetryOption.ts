import type { IFrameRetry } from '#interfaces/options/IFrameRetry';

export function mergeRetryOption(prev: IFrameRetry, next: IFrameRetry): IFrameRetry {
  return {
    ...prev,
    ...(next.max != null && { max: next.max }),
    ...(next.interval != null && { interval: next.interval }),
    ...(next.useRetryAfter != null && { useRetryAfter: next.useRetryAfter }),
    ...(next.getInterval != null && { getInterval: next.getInterval }),
  };
}
