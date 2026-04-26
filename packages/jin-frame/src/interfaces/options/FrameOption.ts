import type { FrameRetry } from '#interfaces/options/FrameRetry';
import type { Method } from '#interfaces/options/Method';
import type { BaseValidator } from '#validators/BaseValidator';
import type { SecurityProvider } from '#interfaces/security/SecurityProvider';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { Milliseconds } from '#interfaces/options/Milliseconds';

export interface FrameOption {
  /**
   * host and path of API Request endpoint
   *
   * 원한다면 protocol://host/path 전체를 host에 전달해도 정상 동작한다. 그럼에도 불구하고
   * 굳이 host와 path를 분리한 이유는 Parent Class에 host를 설정하고 그것을 계속 상속을 받아서
   * 사용하는 방식으로 확장하는 경우, Child Class에서는 path만 설정할 수 있어야 하기 때문에
   * 둘을 분리해서 처리할 수도 있어야 한다.
   * */
  host?: string | (() => string);

  /**
   * Path prefix of API Request endpoint
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

  /** path of API Request endpoint */
  path?: string | (() => string);

  /** method of API Request endpoint */
  method: Method;

  /** content-type of API Request endpoint */
  contentType: string;

  /** user agent of API Request endpoint */
  userAgent?: string;

  /** custom object of POST Request body data */
  customBody?: unknown;

  /** retry configuration */
  retry?: FrameRetry;

  /** timeout of the request */
  timeout?: Milliseconds;

  /**
   * Security providers for authentication
   * Can be a single provider or array of providers for multiple authentication schemes
   * */
  security?: SecurityProvider | SecurityProvider[];

  /**
   * Authorization data that will be passed to security providers
   * This data can be used by providers to generate authentication information
   * */
  authorization?: AuthorizationData;

  /**
   * Validators for pass and fail responses.
   * - pass: runs when HTTP response is successful; can throw JinValidationError if type is 'exception'
   * - fail: runs when HTTP response fails; only sets valid flag, never throws JinValidationError
   */
  validators?: { pass?: BaseValidator; fail?: BaseValidator };

  /**
   * 이 값을 활성화 하는 경우 동일 요청이 반복되는 경우 dedupe 처리를 합니다
   */
  dedupe?: boolean;

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
