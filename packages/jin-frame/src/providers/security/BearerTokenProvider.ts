import type { AuthorizationData } from '#interfaces/security/AuthorizationData';
import type { SecurityContext } from '#interfaces/security/SecurityContext';
import type { SecurityProvider } from '#interfaces/security/SecurityProvider';

/**
 * Bearer Token security provider for HTTP Bearer Token authentication.
 * Automatically adds "Bearer " prefix to tokens if not already present.
 * Call `setKey()` to update the token at runtime (e.g. after token refresh).
 */
export class BearerTokenProvider implements SecurityProvider {
  readonly type = 'http' as const;

  readonly name: string;

  private _internalKey?: string;

  constructor(name = 'bearer') {
    this.name = name;
  }

  setKey(key: string): this {
    this._internalKey = key;
    return this;
  }

  createContext(authorization?: AuthorizationData, dynamicKey?: string): SecurityContext {
    const token = dynamicKey ?? this._internalKey ?? (typeof authorization === 'string' ? authorization : undefined);

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
