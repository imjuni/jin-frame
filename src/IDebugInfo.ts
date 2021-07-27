import { AxiosProxyConfig } from 'axios';

/**
 * Debugging information
 */
export interface IDebugInfo {
  /** timeout configuration on AxiosRequestConfig */
  timeout?: number;

  /** timestamp information at request start at */
  ts: {
    /** unix timestamp style timestamp with milliseconds */
    unix: string;
    /**
     * iso timestamp style without hypen, only contain T character and dot
     * ex> 20210721T112233.444
     * */
    iso: string;
  };

  /** reqeust execute duration */
  duration: number;

  /** request url */
  url?: string;

  /** If you use Node.js environment that indicate of using httpAgent */
  httpAgent: boolean;

  /** If you use Node.js environment that indicate of using httpsAgent */
  httpsAgent: boolean;

  /** proxy configuration */
  proxy?: AxiosProxyConfig;
}
