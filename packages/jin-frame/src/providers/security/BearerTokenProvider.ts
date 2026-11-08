import { ApiKeyProvider, type ProviderKey } from "#providers/security/ApiKeyProvider";

/** Sends a Bearer token through the shared API key provider. */
export class BearerTokenProvider extends ApiKeyProvider {
  override readonly type = "http" as const;

  constructor(key?: ProviderKey, name = "bearer") {
    super(key, "Authorization", "header", name);
  }

  protected override formatKey(key: string): string {
    return key.startsWith("Bearer ") ? key : `Bearer ${key}`;
  }
}
