import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { JinBasicAuth } from '#interfaces/JinBasicAuth';
import type { Milliseconds } from '#interfaces/options/Milliseconds';

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

  auth?: JinBasicAuth;

  timeout?: Milliseconds;

  /**
   * AbortSignal to cancel the request.
   * Combined with the timeout signal when both are provided.
   */
  signal?: AbortSignal;

  /**
   * Dynamic authorization data that will be passed to security providers
   * This will override the authorization data configured in the frame
   */
  dynamicAuth?: AuthorizationData;

  /**
   * When true, clones the raw Response before consuming the body.
   * Allows reading reap.raw after the stream is consumed.
   * Incurs memory overhead - use only when raw access is needed.
   */
  cloneRaw?: boolean;

  /**
   * Custom response body deserializer.
   *
   * Receives the raw response text and returns the parsed value.
   * Useful for handling non-standard JSON (e.g. BigInt values).
   * If not provieded, JSON.parse is used.
   */
  deserialize?: (text: string) => unknown;
}
