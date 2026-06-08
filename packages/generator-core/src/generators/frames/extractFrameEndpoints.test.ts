import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { extractFrameEndpoints } from "#generators/frames/extractFrameEndpoints.js";

describe("extractFrameEndpoints", () => {
  it("should extract endpoint data from document paths", () => {
    const endpoints = extractFrameEndpoints({
      params: {
        specTypeFilePath: "/a/b/paths.d.ts",
        output: "/a/b",
        useCodeFence: false,
        document: {} as OpenAPIV3.Document,
        overrides: {
          hosts: { "/pets/{petId}": "https://override.example.com" },
          retries: { "/pets/{petId}": { max: 3, interval: 500 } },
          timeouts: { "/pets/{petId}": 3000 },
        },
      },
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/pets/{petId}": {
            parameters: [
              {
                name: "petId",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            get: {
              operationId: "getPet",
              responses: { "200": { description: "Success" } },
            },
          },
        },
      },
      host: "https://api.example.com",
    });

    expect(endpoints).toHaveLength(1);
    expect(endpoints.at(0)).toMatchObject({
      specTypeFilePath: "/a/b/paths.d.ts",
      output: "/a/b",
      host: "https://api.example.com",
      hostOverride: "https://override.example.com",
      pathKey: "/pets/{petId}",
      method: "get",
      retry: { max: 3, interval: 500 },
      timeout: 3000,
    });
    expect(endpoints.at(0)?.operation.parameters).toHaveLength(1);
  });
});
