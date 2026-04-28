import type { FrameRetry } from '#interfaces/options/FrameRetry';
import type { Method } from '#interfaces/options/Method';
import type { BaseValidator } from '#validators/BaseValidator';
import type { SecurityProvider } from '#interfaces/security/SecurityProvider';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { Milliseconds } from '#interfaces/options/Milliseconds';

export interface FrameOption {
  /**
   * Base URL of the API endpoint.
   *
   * You may pass the full `protocol://host/path` in this field alone, but separating `host`
   * and `path` is recommended so that a parent class can define the host and child classes
   * only override the path.
   */
  host?: string | (() => string);

  /**
   * Path prefix of API Request endpoint.
   *
   * For example, you can set the relative path defined in the OpenAPI Spec's servers field to pathPrefix.
   * When set, this path will be prepended to the pathname when generating the Request URL.
   *
   * @example
   * ```typescript
   * // OpenAPI servers configuration:
   * // servers: [{ "url": "/api/v3" }]
   * pathPrefix: '/api/v3'
   * path: '/users/{id}'
   * // Final URL: https://example.com/api/v3/users/123
   *
   * // Multiple path prefixes for different services
   * pathPrefix: '/user-service/v1'  // User API
   * pathPrefix: '/order-service/v2' // Order API
   * ```
   */
  pathPrefix?: string | (() => string);

  /** Path of the API endpoint. Supports path-parameter placeholders such as `:id`. */
  path?: string | (() => string);

  /** HTTP method of the endpoint. */
  method: Method;

  /** Content-Type of the request body. */
  contentType: string;

  /** User-Agent string sent with each request. */
  userAgent?: string;

  /** Custom request body that bypasses decorator-based body assembly. */
  customBody?: unknown;

  /** Retry configuration. */
  retry?: FrameRetry;

  /** Request timeout in milliseconds. */
  timeout?: Milliseconds;

  /**
   * Security providers for authentication.
   * Can be a single provider or an array of providers for multiple authentication schemes.
   */
  security?: SecurityProvider | SecurityProvider[];

  /**
   * Authorization data passed to security providers.
   * Used by providers to generate authentication headers or query parameters.
   */
  authorization?: AuthorizationData;

  /**
   * Validators for pass and fail responses.
   * - pass: runs when HTTP response is successful; can throw JinValidationError if type is 'exception'
   * - fail: runs when HTTP response fails; only sets valid flag, never throws JinValidationError
   */
  validators?: { pass?: BaseValidator; fail?: BaseValidator };

  /**
   * Determines whether a response status code is considered successful.
   * When not provided, defaults to `response.ok` (i.e. 200–299).
   *
   * Setting this at the decorator level applies it as the default for all executions of the frame.
   * A `validateStatus` passed to `_execute()` takes precedence over this value.
   *
   * @example
   * ```typescript
   * // Treat 404 as a success (e.g. idempotent DELETE)
   * validateStatus: (ok, status) => ok || status === 404
   * ```
   */
  validateStatus?: (ok: boolean, status: number) => boolean;

  /**
   * When enabled, identical concurrent requests are deduplicated — only one network call
   * is made and the result is shared with all callers.
   */
  dedupe?: boolean;

  /**
   * When true, clones the raw Response before consuming the body.
   * Allows reading resp.raw after the stream is consumed.
   * Incurs memory overhead — use only when raw access is needed.
   */
  cloneRaw?: boolean;

  /**
   * Custom response body deserializer.
   *
   * Receives the raw response text and returns the parsed value.
   * Useful for handling non-standard JSON (e.g. BigInt values).
   * If not provided, JSON.parse is used with a plain-string fallback.
   */
  deserialize?: (text: string) => unknown;
}
