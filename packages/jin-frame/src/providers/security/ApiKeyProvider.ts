import type { AuthorizationData } from "#interfaces/security/AuthorizationData";
import type { SecurityContext } from "#interfaces/security/SecurityContext";
import type { SecurityProvider } from "#interfaces/security/SecurityProvider";

/** A key or a synchronous key supplier evaluated when building each request. */
export type ProviderKey = string | (() => string);

/** Places a key in a header, query parameter, or cookie. */
export class ApiKeyProvider implements SecurityProvider {
  readonly type: SecurityProvider["type"] = "api-key";
  readonly name: string;
  private key?: ProviderKey;
  private readonly keyName: string;
  private readonly location: "header" | "query" | "cookie";

  constructor(
    key: ProviderKey | undefined,
    keyName: string,
    location: "header" | "query" | "cookie" = "header",
    name = "api-key",
  ) {
    this.key = key;
    this.keyName = keyName;
    this.location = location;
    this.name = name;
  }

  setKey(key: ProviderKey): this {
    this.key = key;
    return this;
  }

  protected formatKey(key: string): string {
    return key;
  }

  createContext(authorization?: AuthorizationData, dynamicKey?: string): SecurityContext {
    const supplied = dynamicKey ?? (typeof this.key === "function" ? this.key() : this.key);
    const fallback = ApiKeyProvider.extractKey(authorization);
    const key = supplied ?? fallback;

    if (typeof key !== "string") {
      return {};
    }

    const value = this.formatKey(key);

    if (this.location === "query") {
      return { queries: { [this.keyName]: value } };
    }

    if (this.location === "cookie") {
      return { headers: { Cookie: `${this.keyName}=${value}` } };
    }

    if (this.location === "header") {
      return { headers: { [this.keyName]: value } };
    }

    return {};
  }
  private static extractKey(authorization?: AuthorizationData): string | undefined {
    if (typeof authorization === "string") return authorization;
    if (authorization && typeof authorization === "object" && "key" in authorization)
      return authorization.key as string;
    return undefined;
  }
}
