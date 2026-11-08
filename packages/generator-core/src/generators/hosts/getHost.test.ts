import { describe, expect, it } from "vitest";
import { getHost } from "./getHost.js";

describe("getHost", () => {
  const document = {
    openapi: "3.0.0",
    info: {
      title: "Example",
      version: "1.0.0",
    },
    servers: [{ url: "http://example.com" }],
    paths: {},
  };

  it("should return host when host is provided", () => {
    const result = getHost({ host: "http://example.com", specTypeFilePath: "http://example.com", document });
    expect(result).toEqual("http://example.com");
  });

  it("should throw error when specTypeFilePath is invalid and no usable server url found", () => {
    const emptyDocument = { ...document, servers: [] };
    expect(() => getHost({ specTypeFilePath: "invald", document: emptyDocument })).toThrowError();
  });

  it("should return server url when specTypeFilePath is invalid but document has absolute server url", () => {
    const result = getHost({ specTypeFilePath: "invald", document });
    expect(result).toEqual("http://example.com/");
  });

  it("should return host when host is not provided", () => {
    const result = getHost({
      specTypeFilePath: "http://example.com",
      document,
    });
    expect(result).toEqual("http://example.com/");
  });

  it("should return host when host is not provided", () => {
    const result = getHost({
      specTypeFilePath: "http://example.com",
      document: { ...document, servers: [{ url: "/api" }] },
    });
    expect(result).toEqual("http://example.com/api");
  });

  it("should return host when host is not provided", () => {
    const result = getHost({
      specTypeFilePath: "http://example.com",
      document: { ...document, servers: [] },
    });
    expect(result).toEqual("http://example.com/");
  });
});

it.each([undefined, []])("should use only the remote specification origin when servers is %j", (servers) => {
  expect(
    getHost({
      specTypeFilePath: "http://localhost:7878/swagger/json?format=openapi#schema",
      document: { openapi: "3.0.0", info: { title: "Test", version: "1" }, paths: {}, servers },
    }),
  ).toBe("http://localhost:7878/");
});

it("should preserve an explicit server prefix when the specification has a nested path", () => {
  expect(
    getHost({
      specTypeFilePath: "https://docs.example.com/swagger/json",
      document: {
        openapi: "3.0.0",
        info: { title: "Test", version: "1" },
        paths: {},
        servers: [{ url: "https://api.example.com/v1" }],
      },
    }),
  ).toBe("https://api.example.com/v1");
});
