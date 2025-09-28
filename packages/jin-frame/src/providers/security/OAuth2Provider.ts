import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { ISecurityContext } from '#interfaces/security/ISecurityContext';
import type { ISecurityProvider } from '#interfaces/security/ISecurityProvider';

/**
 * OAuth2 security provider that implements OAuth 2.0 token authentication.
 * Supports configurable token types (Bearer, etc.) and access token extraction.
 */
export class OAuth2Provider implements ISecurityProvider {
  /** Type identifier for this security provider */
  readonly type = 'oauth2' as const;

  /** Name of this security provider instance */
  readonly name: string;

  /** The type of token to use in the Authorization header */
  private readonly tokenType: string;

  /**
   * Creates a new OAuth2 provider
   * @param name - Name of this security provider instance
   * @param tokenType - The token type to use in Authorization header (e.g., 'Bearer', 'Token')
   */
  constructor(name: string, tokenType = 'Bearer') {
    this.name = name;
    this.tokenType = tokenType;
  }

  /**
   * Creates security context with OAuth2 authentication
   * @param authorization - Authorization data containing the access token
   * @param dynamicKey - Optional dynamic access token that overrides the authorization data
   * @returns Security context with OAuth2 token applied to Authorization header
   */
  createContext(authorization?: AuthorizationData, dynamicKey?: string): ISecurityContext {
    const token = dynamicKey ?? OAuth2Provider.extractAccessToken(authorization);

    if (token == null || typeof token !== 'string') {
      return {};
    }

    const authHeader = token.startsWith(`${this.tokenType} `) ? token : `${this.tokenType} ${token}`;

    return {
      headers: {
        Authorization: authHeader,
      },
    };
  }

  /**
   * Extracts the access token from authorization data
   * @param authorization - Authorization data that can be a string or an object with 'accessToken' property
   * @returns The extracted access token or undefined if not found
   */
  private static extractAccessToken(authorization?: AuthorizationData): string | undefined {
    if (typeof authorization === 'string') {
      return authorization;
    }

    if (authorization && typeof authorization === 'object' && 'accessToken' in authorization) {
      return authorization.accessToken as string;
    }

    return undefined;
  }
}
