import type { FrameRetry } from '#interfaces/options/FrameRetry';

export interface FrameInternal {
  query?: Record<string, string | string[]>;

  header?: Record<string, string>;

  body?: unknown;

  param?: Record<string, string>;

  retry: FrameRetry & { try: number };

  startAt: Date;

  eachStartAt: Date;

  endAt: Date;
}
