/**
 * Authorization data that can be used by security providers.
 *
 * When a function is provided, it is resolved asynchronously at request time via `_execute()`.
 * This enables lazy loading from environment variables, secret managers, etc.
 *
 * @example
 * ```typescript
 * // Static bearer token
 * const bearerAuth: AuthorizationData = 'my-bearer-token';
 *
 * // Lazy resolution from dotenv
 * const lazyAuth: AuthorizationData = () => process.env.API_TOKEN ?? '';
 *
 * // Async from secret manager
 * const asyncAuth: AuthorizationData = async () => vault.getSecret('api-token');
 *
 * // Basic auth credentials
 * const basicAuth: AuthorizationData = { username: 'user', password: 'pass' };
 *
 * // API key object
 * const apiKeyAuth: AuthorizationData = { key: 'x-api-key', value: 'my-api-key' };
 * ```
 */
export type AuthorizationData =
  | string
  | (() => string | Promise<string>)
  | { username: string; password: string }
  | { key: string; value: string }
  | { accessToken: string; refreshToken?: string }
  | Record<string, unknown>;
