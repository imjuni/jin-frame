import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JinRequestConfig<T = any> = AxiosRequestConfig<T>;

export type JinFrameResponse<TPASS, TFAIL> = AxiosResponse<TPASS> | AxiosResponse<TFAIL>;
