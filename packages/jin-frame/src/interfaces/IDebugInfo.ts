import type { AxiosRequestConfig } from 'axios';

/**
 * Debugging information
 */
export interface IDebugInfo {
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

  /** AxiosRequestConfig */
  req: AxiosRequestConfig;
}
