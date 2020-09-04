import { AxiosRequestConfig, AxiosProxyConfig } from 'axios';

export default interface IJinFrameRequestParams {
  timeout?: number;
  userAgent?: string;
  validateStatus?: AxiosRequestConfig['validateStatus'];
  proxy?: AxiosProxyConfig;
}
