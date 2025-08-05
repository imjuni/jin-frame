import type { IFrameRetry } from '#interfaces/IFrameRetry';
import type { AxiosRequestConfig, Method } from 'axios';

export interface JinBuiltInOption {
  $$host?: string;
  $$path?: string;
  $$method?: Method;
  $$contentType?: string;
  $$customBody?: unknown;
  $$transformRequest?: AxiosRequestConfig['transformRequest'];
  $$retry?: IFrameRetry;
  $$instance?: boolean;
}
