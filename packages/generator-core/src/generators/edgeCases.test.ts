import { expect, it } from "vitest";
import { getJsonArgument } from "#generators/json/getJsonArgument.js";
import { splitServerUrl } from "#generators/frames/splitServerUrl.js";
import { mergeParameters } from "#generators/frames/mergeParameters.js";
import { buildServerMappingFromServers } from "#generators/hosts/buildServerMappingFromServers.js";
import { getFrameDecoratorArgument } from "#generators/base-frame/getFrameDecoratorArgument.js";
import { getServerVariableName } from "#generators/base-frame/getServerVariableName.js";
import { getServerVariableDocs } from "#generators/base-frame/getServerVariableDocs.js";
import { createSecurityProviderData } from "#generators/security/createSecurityProviderData.js";
import { validate } from "#openapi/validate.js";

it("should serialize nested literals and omit unsupported values when generating arguments", () => {
  expect(getJsonArgument({ values: [{ key: "array", value: [1, true, "x", {}] }] })).toBe(
    "{ array: [1, true, 'x', {}] }",
  );
  expect(getJsonArgument({ values: [{ key: "array", value: [undefined] }] })).toBeUndefined();
  expect(
    getJsonArgument({ values: [{ key: "object", value: { missing: undefined, empty: null, value: false } }] }),
  ).toBe("{ object: { value: false } }");
  const fn = () => "host";
  expect(getJsonArgument({ values: [{ key: "object", value: { fn } }] })).toContain(fn.toString());
  expect(getJsonArgument({ values: [{ key: "unsupported", value: Symbol("x") }] })).toBeUndefined();
});
it.each([
  ["/api/v1", { pathPrefix: "/api/v1" }],
  ["localhost", { host: "localhost" }],
  ["https://example.com", { host: "https://example.com", pathPrefix: undefined }],
  ["https://{env}.example.com/api", { host: "https://{env}.example.com", pathPrefix: "/api" }],
  ["https://{env}.example.com", { host: "https://{env}.example.com", pathPrefix: undefined }],
])("should split server addresses when given %s", (url, result) => {
  expect(splitServerUrl(url)).toEqual(result);
});
it("should preserve reference parameters when merging endpoint parameters", () => {
  const reference = { $ref: "#/components/parameters/Id" };
  expect(mergeParameters([reference], [reference])).toEqual([reference]);
  expect(mergeParameters()).toBeUndefined();
});
it("should classify unnamed servers and provide a development fallback when no dev server exists", () => {
  expect(buildServerMappingFromServers([{ url: "https://one.test" }, { url: "https://two.test" }])).toEqual({
    server0: "https://one.test",
    production: "https://two.test",
    development: "https://one.test",
  });
  expect(buildServerMappingFromServers([])).toEqual({});
});
it("should prefer code expressions and quote invalid names when building server metadata", () => {
  expect(getFrameDecoratorArgument({ hostCode: "getHost", pathPrefixCode: "getPath" })).toBe(
    "{ host: getHost, pathPrefix: getPath }",
  );
  expect(getFrameDecoratorArgument({})).toBe("{}");
  expect(getServerVariableName("api-version")).toBe("'api-version'");
  expect(getServerVariableName("version")).toBe("version");
  expect(getServerVariableDocs({ default: "", enum: [] })).toBe("@default ");
});
it("should generate HTTP providers and skip unsupported schemes when configuring security", () => {
  const result = createSecurityProviderData({
    openapi: "3.0.3",
    info: { title: "test", version: "1" },
    paths: {},
    components: {
      securitySchemes: {
        basic: { type: "http", scheme: "basic" },
        digest: { type: "http", scheme: "digest" },
        ref: { $ref: "#/missing" },
      },
    },
  });
  expect(result.providers.map((provider) => provider.builtinClassName)).toEqual(["BasicAuthProvider"]);
  expect(result.references.has("digest")).toBe(false);
});
it("should recognize Swagger documents and reject invalid specs when validating", () => {
  expect(validate({ swagger: "2.0", info: { title: "Test", version: "1" }, paths: {} }).valid).toBe(true);
  expect(validate({}).valid).toBe(false);
});

it("should resolve relative servers against spec URLs and fall back to spec hosts", async () => {
  const { getServerFrameEndpoint } = await import("#generators/frames/getServerFrameEndpoint.js");
  const params = {
    output: "out",
    specTypeFilePath: "https://example.com",
    useCodeFence: false,
    document: { openapi: "3.0.3", info: { title: "Test", version: "1" }, paths: {} },
  };
  expect(getServerFrameEndpoint(params, { ...params.document, servers: [{ url: "/api" }] })).toMatchObject({
    host: "https://example.com",
    pathPrefix: "/api",
  });
  expect(getServerFrameEndpoint(params, params.document)).toMatchObject({
    host: "https://example.com",
    pathPrefix: undefined,
  });
  const { getHost } = await import("#generators/hosts/getHost.js");
  expect(getHost({ specTypeFilePath: "spec.json", document: { ...params.document, servers: [{ url: "/api" }] } })).toBe(
    "/api",
  );
});

it("should generate standalone base frames and unique file names when using public utilities", async () => {
  const { createBaseFrame } = await import("#generators/createBaseFrame.js");
  const { randomFilename } = await import("#tools/randomFilename.js");
  const { getBaseHost } = await import("#generators/hosts/getBaseHost.js");
  expect(createBaseFrame({ output: "out", name: "BaseFrame", host: "https://example.com" }).source).toContain(
    "export class BaseFrame",
  );
  expect(randomFilename()).toMatch(/\.ts$/);
  expect(randomFilename(".json")).toMatch(/\.json$/);
  expect(
    getBaseHost({ host: "https://api.example.com", spec: { from: "url", path: "https://example.com/spec" } }).map(
      (entry) => entry.kind,
    ),
  ).toEqual(["option", "spec-url"]);
  expect(getBaseHost({ spec: { from: "file", path: "spec.json" } })).toEqual([]);
});

it("should embed callable hosts when rendering method decorators", async () => {
  const { getMethodDecorator } = await import("#generators/content-type/getMethodDecorator.js");
  const host = () => "https://example.com";
  const decorator = getMethodDecorator({ host, path: "/pets", method: "Get" });
  expect(decorator.arguments?.[0]).toContain(`host: ${host.toString()}`);
  expect(decorator.arguments?.[0]).toContain("path: '/pets'");
});

it("should retain relative server paths when the specification is local", async () => {
  const { getServerFrameEndpoint } = await import("#generators/frames/getServerFrameEndpoint.js");
  const document = {
    openapi: "3.0.3",
    info: { title: "Test", version: "1" },
    paths: {},
    servers: [{ url: "/api/v3" }],
  };
  expect(
    getServerFrameEndpoint({ document, output: "out", specTypeFilePath: "paths.d.ts", useCodeFence: false }, document),
  ).toEqual({ pathPrefix: "/api/v3", serverVariables: undefined });
});

it("should preserve URL shaped values when strict URL parsing rejects the host", () => {
  expect(splitServerUrl("https://invalid host/api")).toEqual({ host: "https://invalid host", pathPrefix: "/api" });
});
