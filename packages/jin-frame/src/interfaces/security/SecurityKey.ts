/**
 * A security key that can be a static string or a function that returns a string asynchronously.
 * Supports lazy resolution from environment variables, secret managers (e.g. HashiCorp Vault), etc.
 *
 * @example
 * ```ts
 * // Static string
 * const key: SecurityKey = 'my-bearer-token';
 *
 * // From dotenv at request time
 * const key: SecurityKey = () => process.env.API_TOKEN ?? '';
 *
 * // Async from secret manager
 * const key: SecurityKey = async () => vault.getSecret('api-token');
 * ```
 */
export type SecurityKey = string | (() => string | Promise<string>);
