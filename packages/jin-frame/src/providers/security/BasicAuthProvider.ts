import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { ISecurityContext } from '#interfaces/security/ISecurityContext';
import type { ISecurityProvider } from '#interfaces/security/ISecurityProvider';

/**
 * Basic Authentication security provider that implements HTTP Basic Auth.
 * Supports both username/password pairs and pre-encoded Basic auth strings.
 */
export class BasicAuthProvider implements ISecurityProvider {
  /** Type identifier for this security provider */
  readonly type = 'http' as const;

  /** Name of this security provider instance */
  readonly name: string;

  /**
   * Creates a new Basic Authentication provider
   * @param name - Name of this security provider instance
   */
  constructor(name = 'basic') {
    this.name = name;
  }

  /**
   * Creates security context with Basic Authentication
   * @param authorization - Authorization data containing username/password or Basic auth string
   * @param dynamicKey - Optional dynamic Basic auth string that overrides the authorization data
   * @returns Security context with Basic auth applied to headers or auth property
   */
  // eslint-disable-next-line class-methods-use-this
  createContext(authorization?: AuthorizationData, dynamicKey?: string): ISecurityContext {
    if (dynamicKey) {
      return BasicAuthProvider.handleDynamicKey(dynamicKey);
    }

    return BasicAuthProvider.handleAuthorization(authorization);
  }

  /**
   * Handles dynamic key for Basic Authentication
   * @param dynamicKey - The dynamic Basic auth string
   * @returns Security context with Authorization header
   */
  private static handleDynamicKey(dynamicKey: string): ISecurityContext {
    if (dynamicKey.startsWith('Basic ')) {
      return {
        headers: {
          Authorization: dynamicKey,
        },
      };
    }

    return {
      headers: {
        Authorization: `Basic ${dynamicKey}`,
      },
    };
  }

  /**
   * Handles authorization data for Basic Authentication
   * @param authorization - Authorization data that can be a string or an object with username/password
   * @returns Security context with either Authorization header or auth credentials
   */
  private static handleAuthorization(authorization?: AuthorizationData): ISecurityContext {
    if (typeof authorization === 'string') {
      const basicAuth = authorization.startsWith('Basic ') ? authorization : `Basic ${authorization}`;
      return {
        headers: {
          Authorization: basicAuth,
        },
      };
    }

    if (
      authorization &&
      typeof authorization === 'object' &&
      'username' in authorization &&
      'password' in authorization
    ) {
      return {
        auth: {
          username: authorization.username as string,
          password: authorization.password as string,
        },
      };
    }

    return {};
  }
}
