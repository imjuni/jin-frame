/**
 * Authorization data that can be used by security providers
 *
 * @example
 * ```typescript
 * // Bearer token
 * const bearerAuth: AuthorizationData = 'my-bearer-token';
 *
 * // Basic auth credentials
 * const basicAuth: AuthorizationData = { username: 'user', password: 'pass' };
 *
 * // API key
 * const apiKeyAuth: AuthorizationData = { key: 'x-api-key', value: 'my-api-key' };
 *
 * // OAuth2 tokens
 * const oauth2Auth: AuthorizationData = {
 *   accessToken: 'access-token',
 *   refreshToken: 'refresh-token'
 * };
 * ```
 */
export type AuthorizationData =
  | string
  | { username: string; password: string }
  | { key: string; value: string }
  | { accessToken: string; refreshToken?: string }
  | Record<string, unknown>;
