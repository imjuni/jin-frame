import type { AxiosRequestConfig } from 'axios';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';

/**
 * Configuration for AxiosRequestConfig. Exclude headers, method, data, url, validateStatus.
 * headers, method, data, url, validateStatus use jin-frame configuration value.
 */
export interface IJinFrameRequestConfig
  extends Omit<AxiosRequestConfig, 'headers' | 'method' | 'data' | 'url' | 'validateStatus'> {
  /**
   * User-Agent string. Axios use Custom Use-Agent string like "axios/0.27.2". You can change
   * that string by useAgent field.
   */
  userAgent?: string;

  url?: string;

  customBody?: unknown;

  /**
   * Dynamic authorization data that will be passed to security providers
   * This will override the authorization data configured in the frame
   */
  dynamicAuth?: AuthorizationData;
}
