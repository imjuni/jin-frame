import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { ISecurityContext } from '#interfaces/security/ISecurityContext';

/**
 * Security provider interface for handling different authentication schemes
 *
 * Providers implement specific authentication methods like Bearer tokens, API keys, OAuth2, etc.
 * They can be used individually or combined to support multiple authentication schemes per endpoint.
 *
 * @example
 * ```typescript
 * class CustomBearerProvider implements ISecurityProvider {
 *   readonly type = 'http';
 *   readonly name = 'custom-bearer';
 *
 *   createContext(authorization?: AuthorizationData, dynamicKey?: string): ISecurityContext {
 *     const token = dynamicKey ?? authorization;
 *     return {
 *       headers: {
 *         Authorization: `Bearer ${token}`
 *       }
 *     };
 *   }
 * }
 *
 * // Usage in frame
 * @Get({
 *   host: 'https://api.example.com',
 *   security: new CustomBearerProvider(),
 *   authorization: 'my-token'
 * })
 * class MyFrame extends JinFrame {}
 * ```
 */
export interface ISecurityProvider {
  /** The type of security scheme (following OpenAPI 3.0 security scheme types) */
  readonly type: 'api-key' | 'http' | 'oauth2' | 'open-id-connect';

  /** Unique name for this security provider instance */
  readonly name: string;

  /**
   * Create authentication context for the request
   *
   * @param authorization - The authorization data configured in the frame
   * @param dynamicKey - Dynamic key passed at runtime (takes precedence over authorization)
   * @returns Security context with headers, auth, and params to be applied to the request
   *
   * @example
   * ```typescript
   * // Called with frame authorization
   * const context1 = provider.createContext('bearer-token');
   *
   * // Called with dynamic key (overrides frame authorization)
   * const context2 = provider.createContext('frame-token', 'runtime-token');
   * ```
   */
  createContext: (authorization?: AuthorizationData, dynamicKey?: string) => ISecurityContext;
}
