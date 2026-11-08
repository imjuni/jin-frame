import { expect, it, vi } from "vitest";
import { ApiKeyProvider } from "#providers/security/ApiKeyProvider";
import { BasicAuthProvider } from "#providers/security/BasicAuthProvider";
import { BearerTokenProvider } from "#providers/security/BearerTokenProvider";
import { applySecurityProviders } from "#tools/auth/applySecurityProviders";

it("should resolve current keys when suppliers change between requests", () => {
  let token = "first";
  const supplier = vi.fn(() => token);
  const provider = new BearerTokenProvider(supplier);
  expect(provider).toBeInstanceOf(ApiKeyProvider);
  expect(provider.createContext().headers?.Authorization).toBe("Bearer first");
  token = "second";
  expect(provider.createContext().headers?.Authorization).toBe("Bearer second");
  expect(provider.createContext(undefined, "override").headers?.Authorization).toBe("Bearer override");
  expect(supplier).toHaveBeenCalledTimes(2);
  expect(provider.createContext().headers?.Authorization).toBe("Bearer second");
});

it("should share key handling when Basic and Bearer specialize API keys", () => {
  expect(new ApiKeyProvider("secret", "X-Key").createContext()).toEqual({ headers: { "X-Key": "secret" } });
  expect(new ApiKeyProvider(() => "secret", "key", "query").createContext()).toEqual({ queries: { key: "secret" } });
  expect(new ApiKeyProvider("secret", "session", "cookie").createContext()).toEqual({
    headers: { Cookie: "session=secret" },
  });
  expect(new BasicAuthProvider(() => btoa("user:pass")).createContext()).toEqual({
    headers: { Authorization: `Basic ${btoa("user:pass")}` },
  });
  expect(new BasicAuthProvider("Basic encoded").createContext().headers?.Authorization).toBe("Basic encoded");
  expect(new BearerTokenProvider("Bearer secret").createContext().headers?.Authorization).toBe("Bearer secret");
  expect(new BearerTokenProvider("constructor").createContext("fallback").headers?.Authorization).toBe(
    "Bearer constructor",
  );
});

it("should preserve independent keys when combining security providers", () => {
  const context = applySecurityProviders([
    new BearerTokenProvider(() => "user-token"),
    new ApiKeyProvider(() => "client-key", "X-Client-Key"),
  ]);
  expect(context.headers).toEqual({ Authorization: "Bearer user-token", "X-Client-Key": "client-key" });
});

it("should support HTTP authentication directly when API keys contain full headers", () => {
  expect(new ApiKeyProvider(() => "Bearer token", "Authorization").createContext()).toEqual({
    headers: { Authorization: "Bearer token" },
  });
  expect(new ApiKeyProvider(() => `Basic ${btoa("user:pass")}`, "Authorization").createContext()).toEqual({
    headers: { Authorization: `Basic ${btoa("user:pass")}` },
  });
});
