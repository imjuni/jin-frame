import { AxiosProxyConfig, AxiosRequestConfig } from 'axios';

export default interface IJinFrameRequestParams {
  timeout?: number;
  userAgent?: string;
  validateStatus?: AxiosRequestConfig['validateStatus'];
  proxy?: AxiosProxyConfig;
  httpAgent?: any;
  httpsAgent?: any;
}
