import type { Method } from '#interfaces/options/Method';
import type { Milliseconds } from '#interfaces/options/Milliseconds';

export interface JinRequestConfig {
  url: string;
  method: Method;
  headers: Record<string, string>;
  body?: BodyInit;
  timeout?: Milliseconds;
  signal?: AbortSignal;
}
