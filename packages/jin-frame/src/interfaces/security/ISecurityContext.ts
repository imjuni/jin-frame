import type { AxiosRequestConfig } from 'axios';

/**
 * Security context that contains authentication information to be applied to HTTP requests
 *
 * @example
 * ```typescript
 * const context: ISecurityContext = {
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
export interface ISecurityContext {
  /** HTTP headers to be added to the request */
  headers?: Record<string, string>;

  /** Axios basic auth configuration */
  auth?: AxiosRequestConfig['auth'];

  /** Query parameters to be added to the request */
  queries?: Record<string, string>;
}
