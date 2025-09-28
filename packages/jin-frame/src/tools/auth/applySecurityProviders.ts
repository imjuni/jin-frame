import type { ISecurityProvider } from '#interfaces/security/ISecurityProvider';
import type { ISecurityContext } from '#interfaces/security/ISecurityContext';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';

/**
 * Applies multiple security providers to generate a unified security context.
 *
 * This function processes an array of security providers sequentially, merging their
 * outputs into a single security context. Headers and query parameters are merged additively,
 * while auth configuration uses the last provider's value (last wins strategy).
 *
 * @param providers - Array of security providers to apply
 * @param authorization - Static authorization data configured at frame level
 * @param dynamicAuth - Runtime authorization data that overrides static configuration
 *
 * @returns Unified security context containing:
 * - `headers`: Merged HTTP headers from all providers
 * - `queries`: Merged query parameters from all providers
 * - `auth`: Axios auth configuration from the last provider that provided one
 *
 * @example
 * ```typescript
 * const providers = [apiKeyProvider, bearerTokenProvider];
 * const context = applySecurityProviders(
 *   providers,
 *   { apiKey: 'static-key' },
 *   { token: 'runtime-token' }
 * );
 *
 * // Returns merged context:
 * // {
 * //   headers: { 'X-API-Key': 'static-key', 'Authorization': 'Bearer runtime-token' },
 * //   queries: { ... },
 * //   auth: { ... } // from last provider
 * // }
 * ```
 */
export function applySecurityProviders(
  providers: ISecurityProvider[],
  authorization?: AuthorizationData,
  dynamicAuth?: AuthorizationData,
): ISecurityContext {
  const context: ISecurityContext = {
    headers: {},
    queries: {},
  };

  for (const provider of providers) {
    const authData = dynamicAuth ?? authorization;
    const providerContext = provider.createContext(authData, typeof dynamicAuth === 'string' ? dynamicAuth : undefined);

    // Merge headers
    if (providerContext.headers) {
      context.headers = { ...context.headers, ...providerContext.headers };
    }

    // Merge queries
    if (providerContext.queries) {
      context.queries = { ...context.queries, ...providerContext.queries };
    }

    // Last provider wins for auth configuration
    if (providerContext.auth) {
      context.auth = providerContext.auth;
    }
  }

  return context;
}
