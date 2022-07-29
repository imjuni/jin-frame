import { AxiosRequestConfig } from 'axios';

/**
 * Configuration for AxiosRequestConfig. Exclude headers, method, data, url, validateStatus.
 * headers, method, data, url, validateStatus use jin-frame configuration value.
 */
export default interface IJinFrameRequestConfig
  extends Omit<AxiosRequestConfig, 'headers' | 'method' | 'data' | 'url' | 'validateStatus'> {
  /**
   * User-Agent string. Axios use Custom Use-Agent string like "axios/0.27.2". You can change
   * that string by useAgent field.
   */
  userAgent?: string;
}
