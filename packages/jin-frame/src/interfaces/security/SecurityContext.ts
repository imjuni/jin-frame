import type { JinBasicAuth } from '#interfaces/JinBasicAuth';

/**
 * Security context that contains authentication information to be applied to HTTP requests
 *
 * @example
 * ```typescript
 * const context: SecurityContext = {
 *   headers: {
 *     'Authorization': 'Bearer token123',
 *     'X-API-Key': 'api-key-value'
 *   },
 *   auth: {
 *     username: 'user',
 *     password: 'pass'
 *   },
 *   queries: {
 *     'api_key': 'query-param-key'
 *   }
 * };
 * ```
 */
export interface SecurityContext {
  /** HTTP headers to be added to the request */
  headers?: Record<string, string>;

  /** Basic authentication credentials */
  auth?: JinBasicAuth;

  /** Query parameters to be added to the request */
  queries?: Record<string, string>;
}
