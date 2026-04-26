import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { SecurityContext } from '#interfaces/security/SecurityContext';
import type { SecurityProvider } from '#interfaces/security/SecurityProvider';

/**
 * Bearer Token security provider that implements HTTP Bearer Token authentication.
 * Automatically adds "Bearer " prefix to tokens if not already present.
 */
export class BearerTokenProvider implements SecurityProvider {
  /** Type identifier for this security provider */
  readonly type = 'http' as const;

  /** Name of this security provider instance */
  readonly name: string;

  /**
   * Creates a new Bearer Token provider
   * @param name - Name of this security provider instance
   */
  constructor(name = 'bearer') {
    this.name = name;
  }

  /**
   * Creates security context with Bearer Token authentication
   * @param authorization - Authorization data containing the bearer token
   * @param dynamicKey - Optional dynamic bearer token that overrides the authorization data
   * @returns Security context with Bearer token applied to Authorization header
   */
  // eslint-disable-next-line class-methods-use-this
  createContext(authorization?: AuthorizationData, dynamicKey?: string): SecurityContext {
    const token = dynamicKey ?? authorization;

    if (token == null || typeof token !== 'string') {
      return {};
    }

    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    return {
      headers: {
        Authorization: bearerToken,
      },
    };
  }
}
