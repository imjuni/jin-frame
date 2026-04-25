import type { IFrameRetry } from '#interfaces/options/IFrameRetry';
import type { JinHttpClient } from '#interfaces/JinHttpClient';

export interface IFrameInternal {
  query?: Record<string, string | string[]>;

  header?: Record<string, string>;

  body?: unknown;

  param?: Record<string, string>;

  retry: IFrameRetry & { try: number };

  instance: JinHttpClient;

  startAt: Date;

  eachStartAt: Date;

  endAt: Date;
}
