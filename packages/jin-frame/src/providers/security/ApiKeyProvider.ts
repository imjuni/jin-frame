import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { ISecurityContext } from '#interfaces/security/ISecurityContext';
import type { ISecurityProvider } from '#interfaces/security/ISecurityProvider';

/**
 * API Key security provider that implements authentication using API keys.
 * Supports API key placement in headers, query parameters, or cookies.
 */
export class ApiKeyProvider implements ISecurityProvider {
  /** Type identifier for this security provider */
  readonly type = 'api-key' as const;

  /** Name of this security provider instance */
  readonly name: string;

  /** The name of the API key parameter */
  private readonly keyName: string;

  /** Location where the API key should be placed */
  private readonly location: 'header' | 'query' | 'cookie';

  /**
   * Creates a new API Key provider
   * @param name - Name of this security provider instance
   * @param keyName - The name of the API key parameter (e.g., 'X-API-Key', 'apikey')
   * @param location - Where to place the API key: 'header', 'query', or 'cookie'
   */
  constructor(name: string, keyName: string, location: 'header' | 'query' | 'cookie' = 'header') {
    this.name = name;
    this.keyName = keyName;
    this.location = location;
  }

  /**
   * Creates security context with API key authentication
   * @param authorization - Authorization data containing the API key
   * @param dynamicKey - Optional dynamic API key that overrides the authorization data
   * @returns Security context with the API key applied to the appropriate location
   */
  createContext(authorization?: AuthorizationData, dynamicKey?: string): ISecurityContext {
    const key = dynamicKey ?? ApiKeyProvider.extractKey(authorization);

    if (key == null) {
      return {};
    }

    switch (this.location) {
      case 'header':
        return {
          headers: {
            [this.keyName]: key,
          },
        };
      case 'query':
        return {
          queries: {
            [this.keyName]: key,
          },
        };
      case 'cookie':
        return {
          headers: {
            Cookie: `${this.keyName}=${key}`,
          },
        };
      default:
        return {};
    }
  }

  /**
   * Extracts the API key from authorization data
   * @param authorization - Authorization data that can be a string or an object with a 'key' property
   * @returns The extracted API key or undefined if not found
   */
  private static extractKey(authorization?: AuthorizationData): string | undefined {
    if (typeof authorization === 'string') {
      return authorization;
    }

    if (authorization && typeof authorization === 'object' && 'key' in authorization) {
      return authorization.key as string;
    }

    return undefined;
  }
}
