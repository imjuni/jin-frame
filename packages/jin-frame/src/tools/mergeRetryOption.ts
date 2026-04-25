import type { FrameRetry } from '#interfaces/options/FrameRetry';

export function mergeRetryOption(prev: FrameRetry, next: FrameRetry): FrameRetry {
  return {
    ...prev,
    ...(next.max != null && { max: next.max }),
    ...(next.interval != null && { interval: next.interval }),
    ...(next.useRetryAfter != null && { useRetryAfter: next.useRetryAfter }),
    ...(next.getInterval != null && { getInterval: next.getInterval }),
  };
}
