import type { IFrameOption } from '#interfaces/options/IFrameOption';
import type { AxiosRequestConfig } from 'axios';
import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import { applySecurityProviders } from '#tools/auth/applySecurityProviders';

/**
 * Extracts and processes authorization information from various sources in priority order.
 *
 * The function follows this priority hierarchy:
 * 1. Authorization header from the headers parameter
 * 2. Axios auth configuration
 * 3. Security providers (new security system)
 * 4. Legacy authorization configuration (deprecated)
 *
 * @param headers - HTTP headers containing potential Authorization header
 * @param frameOption - Frame configuration options containing security and authorization settings
 * @param auth - Optional Axios authentication configuration (username/password)
 * @param dynamicAuth - Optional dynamic authorization data for runtime security provider configuration
 *
 * @returns Authorization result object containing:
 * - `authKey`: Authorization token/key string (from header or legacy config)
 * - `auth`: Axios auth configuration object
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
 * // Using Axios auth
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
  frameOption: Pick<IFrameOption, 'security' | 'authorization'>,
  auth?: AxiosRequestConfig['auth'],
  dynamicAuth?: AuthorizationData,
): {
  authKey?: string;
  auth?: AxiosRequestConfig['auth'];
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
