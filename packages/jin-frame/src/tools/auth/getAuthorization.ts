import { applySecurityProviders } from '#tools/auth/applySecurityProviders';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { FrameOption } from '#interfaces/options/FrameOption';
import type { JinBasicAuth } from '#interfaces/JinBasicAuth';

/**
 * Extracts and processes authorization information from various sources in priority order.
 *
 * The function follows this priority hierarchy:
 * 1. Authorization header from the headers parameter
 * 2. HTTP Basic auth configuration (username/password)
 * 3. Security providers
 *
 * @param headers - HTTP headers containing potential Authorization header
 * @param frameOption - Frame configuration options containing security and authorization settings
 * @param auth - Optional HTTP Basic auth configuration (username/password)
 * @param dynamicAuth - Optional dynamic authorization data for runtime security provider configuration
 *
 * @returns Authorization result object containing:
 * - `authKey`: Authorization token/key string (from header or security provider)
 * - `auth`: HTTP Basic auth configuration object
 * - `securityHeaders`: Additional headers from security providers
 * - `securityQueries`: Query parameters from security providers
 *
 * @example
 * ```typescript
 * // Using Authorization header
 * const result = getAuthorization(
 *   { Authorization: 'Bearer token123' },
 *   frameOption
 * );
 * // Returns: { authKey: 'Bearer token123', auth: undefined }
 *
 * // Using Basic auth
 * const result = getAuthorization(
 *   {},
 *   frameOption,
 *   { username: 'user', password: 'pass' }
 * );
 * // Returns: { authKey: undefined, auth: { username: 'user', password: 'pass' } }
 *
 * // Using security providers
 * const result = getAuthorization(
 *   {},
 *   { security: [apiKeyProvider] },
 *   undefined,
 *   { apiKey: 'key123' }
 * );
 * // Returns: { authKey: undefined, auth: undefined, securityHeaders: {...}, securityQueries: {...} }
 * ```
 */
export function getAuthorization(
  headers: Record<string, string>,
  frameOption: Pick<FrameOption, 'security' | 'authorization'>,
  auth?: JinBasicAuth,
  dynamicAuth?: AuthorizationData,
): {
  authKey?: string;
  auth?: JinBasicAuth;
  securityHeaders?: Record<string, string>;
  securityQueries?: Record<string, string>;
} {
  if (headers.Authorization != null) {
    return { authKey: headers.Authorization, auth: undefined };
  }

  if (auth != null) {
    return { authKey: undefined, auth };
  }

  // Handle SecurityProvider
  if (frameOption.security != null) {
    const providers = Array.isArray(frameOption.security) ? frameOption.security : [frameOption.security];
    const securityContext = applySecurityProviders(providers, frameOption.authorization, dynamicAuth);

    return {
      authKey: securityContext.headers?.Authorization,
      auth: securityContext.auth,
      securityHeaders: securityContext.headers,
      securityQueries: securityContext.queries,
    };
  }

  return { authKey: undefined, auth: undefined };
}
