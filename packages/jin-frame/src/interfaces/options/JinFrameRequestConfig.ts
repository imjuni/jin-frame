import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { JinBasicAuth } from '#interfaces/JinBasicAuth';
import type { Milliseconds } from '#interfaces/options/Milliseconds';

/**
 * Configuration for JinFrame.
 */
export interface JinFrameRequestConfig {
  /**
   * User-Agent string sent with each request.
   * Override this to identify your client (e.g. "my-app/1.0.0").
   */
  userAgent?: string;

  url?: string;

  /**
   * Overrides the host defined in the frame decorator for this request only.
   * Supports URI template syntax (e.g. `https://{tenant}.api.example.com`).
   */
  host?: string;

  /**
   * Overrides the pathPrefix defined in the frame decorator for this request only.
   */
  pathPrefix?: string;

  /**
   * Overrides the path defined in the frame decorator for this request only.
   * Supports URI template syntax (e.g. `/users/{id}`).
   */
  path?: string;

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
   * If not provided, JSON.parse is used.
   */
  deserialize?: (text: string) => unknown;
}
