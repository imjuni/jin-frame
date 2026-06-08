import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { createFrameGenerationContext } from "#generators/frames/createFrameGenerationContext.js";

describe("createFrameGenerationContext", () => {
  it("should create host context from document servers", () => {
    const context = createFrameGenerationContext(
      {
        specTypeFilePath: "/a/b/paths.d.ts",
        output: "/a/b",
        useCodeFence: false,
        document: {} as OpenAPIV3.Document,
      },
      {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        servers: [{ url: "https://api.example.com/v1" }],
        paths: {},
      },
    );

    expect(context).toMatchObject({
      serverFrameEndpoint: {
        host: "https://api.example.com",
        pathPrefix: "/v1",
      },
      host: "https://api.example.com/v1",
    });
  });
});
