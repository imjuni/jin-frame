import type { AxiosInstance } from 'axios';
import type { IFrameRetry } from '#interfaces/IFrameRetry';

export interface IFrameInternal {
  query?: Record<string, string | string[]>;

  header?: Record<string, string>;

  body?: unknown;

  param?: Record<string, string>;

  retry?: IFrameRetry & { try: number };

  instance: AxiosInstance;

  startAt: Date;

  endAt: Date;
}
