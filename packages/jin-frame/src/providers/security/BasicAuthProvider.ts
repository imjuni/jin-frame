import type { AuthorizationData } from "#interfaces/security/AuthorizationData";
import type { SecurityContext } from "#interfaces/security/SecurityContext";
import { ApiKeyProvider, type ProviderKey } from "#providers/security/ApiKeyProvider";

/** Accepts an encoded credential or legacy username/password authorization data. */
export class BasicAuthProvider extends ApiKeyProvider {
  override readonly type = "http" as const;

  constructor(key?: ProviderKey, name = "basic") {
    super(key, "Authorization", "header", name);
  }

  protected override formatKey(key: string): string {
    return key.startsWith("Basic ") ? key : `Basic ${key}`;
  }

  override createContext(authorization?: AuthorizationData, dynamicKey?: string): SecurityContext {
    const context = super.createContext(
      typeof authorization === "string" ? authorization : undefined,
      dynamicKey || undefined,
    );

    if (context.headers) {
      return context;
    }

    if (
      authorization &&
      typeof authorization === "object" &&
      "username" in authorization &&
      "password" in authorization
    ) {
      return { auth: { username: authorization.username as string, password: authorization.password as string } };
    }

    return context;
  }
}
