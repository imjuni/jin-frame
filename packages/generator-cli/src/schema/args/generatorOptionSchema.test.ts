import { describe, expect, it } from "vitest";
import { z } from "zod";
import { generatorOptionSchema, normalizeGeneratorOptionInput } from "#schema/args/generatorOptionSchema.js";

describe("generatorOptionSchema", () => {
  it("should parse endpoint override arguments by OpenAPI path key", () => {
    const schema = z.preprocess(normalizeGeneratorOptionInput, generatorOptionSchema);
    const parsed = schema.parse({
      spec: "/openapi.yml",
      output: "/generated",
      host: ["/pets/{petId}=https://override.example.com", "https://api.example.com"],
      retry: '/pets/{petId}={"max":3,"interval":500}',
      timeout: ["/pets/{petId}=3000", "60000"],
    });

    expect(parsed.host).toBe("https://api.example.com");
    expect(parsed.timeout).toBe(60_000);
    expect(parsed.hosts).toEqual({
      "/pets/{petId}": "https://override.example.com",
    });
    expect(parsed.retries).toEqual({
      "/pets/{petId}": {
        max: 3,
        interval: 500,
      },
    });
    expect(parsed.timeouts).toEqual({
      "/pets/{petId}": 3000,
    });
  });

  it("should keep non endpoint values as global options", () => {
    const schema = z.preprocess(normalizeGeneratorOptionInput, generatorOptionSchema);
    const parsed = schema.parse({
      spec: "/openapi.yml",
      output: "/generated",
      host: "https://api.example.com?version=2026",
      timeout: "30000",
      "int64-as-string": true,
    });

    expect(parsed.host).toBe("https://api.example.com?version=2026");
    expect(parsed.timeout).toBe(30_000);
    expect(parsed.int64AsString).toBe(true);
    expect(parsed.hosts).toBeUndefined();
    expect(parsed.timeouts).toBeUndefined();
  });

  it("should parse security provider options", () => {
    const schema = z.preprocess(normalizeGeneratorOptionInput, generatorOptionSchema);
    const parsed = schema.parse({
      spec: "/openapi.yml",
      output: "/generated",
      "security-provider-dir": "auth",
      securityProviders: {
        bearerAuth: {
          className: "AppBearerTokenProvider",
          importPath: "@/auth/AppBearerTokenProvider",
        },
      },
    });

    expect(parsed.securityProviderDir).toBe("auth");
    expect(parsed.securityProviders).toEqual({
      bearerAuth: {
        className: "AppBearerTokenProvider",
        importPath: "@/auth/AppBearerTokenProvider",
      },
    });
  });
});
