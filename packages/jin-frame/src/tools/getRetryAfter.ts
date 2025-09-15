import type { IFrameRetry } from '#interfaces/options/IFrameRetry';

export function getRetryAfter(retry: IFrameRetry, rawRetryAfter: string | string[] | undefined): number | undefined {
  try {
    const useRetryAfter = retry.useRetryAfter ?? true;

    if (!useRetryAfter || rawRetryAfter == null) {
      return undefined;
    }

    const retryAfter = Array.isArray(rawRetryAfter) ? rawRetryAfter.at(0) : rawRetryAfter;

    if (retryAfter == null) {
      return undefined;
    }

    const parsed = parseInt(retryAfter, 10);

    if (Number.isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}
