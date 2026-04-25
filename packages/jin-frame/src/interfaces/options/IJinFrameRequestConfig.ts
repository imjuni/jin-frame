import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { JinBasicAtuh } from '#interfaces/JinBasicAuth';
import type { TMilliseconds } from '#interfaces/options/TMilliseconds';

/**
 * Configuration for JinFrame.
 */
export interface JinFrameRequestConfig {
  /**
   * User-Agent string. Axios use Custom Use-Agent string like "axios/0.27.2". You can change
   * that string by useAgent field.
   */
  userAgent?: string;

  url?: string;

  customBody?: unknown;

  auth?: JinBasicAtuh;

  timeout?: TMilliseconds;

  /**
   * Dynamic authorization data that will be passed to security providers
   * This will override the authorization data configured in the frame
   */
  dynamicAuth?: AuthorizationData;
}
