import { describe, expect, it } from "vitest";
import { getServerUrl } from "./getServerUrl.js";

describe("getServerUrl", () => {
  it("should return server url when server url is a full url", () => {
    const result = getServerUrl({ specUrl: new URL("http://example.com"), server: { url: "http://example.com" } });
    expect(result).toEqual({ url: new URL("http://example.com") });
  });

  it("should return server url when server url is a relative url", () => {
    const result = getServerUrl({ specUrl: new URL("http://example.com"), server: { url: "/api" } });
    expect(result).toEqual({ url: new URL("http://example.com/api"), prefix: "/api" });
  });
  it.each([
    ["/api", "https://example.com/api"],
    ["api", "https://example.com/docs/api"],
    ["./api", "https://example.com/docs/api"],
    ["../api", "https://example.com/api"],
    ["//api.example.com/v1", "https://api.example.com/v1"],
    ["/api?version=2", "https://example.com/api?version=2"],
  ])("should resolve %s against a specification file URL", (serverUrl, expected) => {
    const specUrl = new URL("https://example.com/docs/openapi.json?download=1#spec");
    const original = specUrl.href;
    expect(getServerUrl({ specUrl, server: { url: serverUrl } })).toEqual({
      url: new URL(expected),
      prefix: serverUrl,
    });
    expect(specUrl.href).toBe(original);
  });
});
