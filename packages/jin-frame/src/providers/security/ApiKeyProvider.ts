import type { AuthorizationData } from "#interfaces/security/AuthorizationData";
import type { SecurityContext } from "#interfaces/security/SecurityContext";
import type { SecurityProvider } from "#interfaces/security/SecurityProvider";

/** A key or a synchronous key supplier evaluated when building each request. */
export type ProviderKey = string | (() => string);

/** Places a key in a header, query parameter, or cookie. */
export class ApiKeyProvider implements SecurityProvider {
  // Provider metadata does not select or route credentials.
  readonly type: SecurityProvider["type"] = "api-key";
  readonly name: string;

  // Credential source shared by requests using this provider.
  private key?: ProviderKey;

  // Destination for the formatted credential.
  private readonly keyName: string;
  private readonly location: "header" | "query" | "cookie";

  /**
   * @param key - Static key or synchronous supplier; undefined uses authorization fallback.
   * @param keyName - Destination name, such as X-API-Key, Authorization, or api_key.
   * @param location - Send the key as a header, query parameter, or cookie.
   * @param name - Provider metadata, independent of the destination name.
   */
  constructor(
    key: ProviderKey | undefined,
    keyName: string,
    location: "header" | "query" | "cookie" = "header",
    name = "api-key",
  ) {
    this.name = name;
    this.key = key;

    this.keyName = keyName;
    this.location = location;
  }

  /** Replaces the shared key source for future requests and returns this provider. */
  setKey(key: ProviderKey): this {
    this.key = key;

    return this;
  }

  /** Override to format credentials, such as adding a Basic or Bearer prefix. */
  protected formatKey(key: string): string {
    return key;
  }

  /**
   * Resolves dynamicKey > provider key > authorization and formats the result.
   * Suppliers run once per context unless dynamicKey is present; errors propagate.
   * Empty strings are preserved; missing or non-string keys produce no credentials.
   * Async authorization suppliers are resolved by _execute(), not by this method.
   */
  createContext(authorization?: AuthorizationData, dynamicKey?: string): SecurityContext {
    // Resolve credentials in priority order without evaluating an overridden supplier.
    const supplied = dynamicKey ?? (typeof this.key === "function" ? this.key() : this.key);
    const fallback = ApiKeyProvider.extractKey(authorization);
    const key = supplied ?? fallback;

    // Skip missing credentials while preserving explicitly supplied empty strings.
    if (typeof key !== "string") {
      return {};
    }

    // Let subclasses apply authentication schemes such as Basic or Bearer.
    const value = this.formatKey(key);

    // Place the formatted credential in the configured request destination.
    switch (this.location) {
      case "query":
        return { queries: { [this.keyName]: value } };
      case "cookie":
        return { headers: { Cookie: `${this.keyName}=${value}` } };
      case "header":
        return { headers: { [this.keyName]: value } };
      default:
        return {};
    }
  }

  /** Supports legacy string and { key: string } authorization values. */
  private static extractKey(authorization?: AuthorizationData): string | undefined {
    if (typeof authorization === "string") {
      return authorization;
    }

    if (authorization && typeof authorization === "object" && "key" in authorization) {
      return authorization.key as string;
    }

    return undefined;
  }
}
