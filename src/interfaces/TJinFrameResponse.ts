import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TJinRequestConfig<T = any> = AxiosRequestConfig<T>;

export type TJinFrameResponse<TPASS, TFAIL> = AxiosResponse<TPASS> | AxiosResponse<TFAIL>;
