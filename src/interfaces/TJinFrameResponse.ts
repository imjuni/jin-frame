import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type TJinRequestConfig<T = any> = AxiosRequestConfig<T>;

export type TJinFrameResponse<TPASS, TFAIL> = AxiosResponse<TPASS> | AxiosResponse<TFAIL>;
