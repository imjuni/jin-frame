import { expectTypeOf, test } from "vitest";
import { ApiKeyProvider } from "#providers/security/ApiKeyProvider";
import { BasicAuthProvider } from "#providers/security/BasicAuthProvider";
import { BearerTokenProvider } from "#providers/security/BearerTokenProvider";

test("should accept strings and synchronous suppliers when configuring provider keys", () => {
  expectTypeOf(new BearerTokenProvider("token")).toExtend<ApiKeyProvider>();
  expectTypeOf(new BasicAuthProvider(() => "encoded")).toExtend<ApiKeyProvider>();
  expectTypeOf(new ApiKeyProvider(() => "key", "X-Key")).toEqualTypeOf<ApiKeyProvider>();
  // @ts-expect-error Request configuration is synchronous; async keys use @Security instead.
  expectTypeOf(new BearerTokenProvider(async () => "token")).toExtend<ApiKeyProvider>();
  // @ts-expect-error Providers require string credentials.
  expectTypeOf(new BasicAuthProvider(123)).toExtend<ApiKeyProvider>();
});
