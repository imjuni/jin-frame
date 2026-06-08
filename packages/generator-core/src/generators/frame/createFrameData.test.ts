import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { createFrameData } from "#generators/frame/createFrameData.js";

describe("createFrameData", () => {
  it("should convert operation into frame data", () => {
    const data = createFrameData({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      pathKey: "/pets/{petId}",
      method: "get",
      timeout: 3000,
      retry: { max: 3, interval: 500 },
      operation: {
        operationId: "getPet",
        tags: ["pet"],
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      } satisfies OpenAPIV3.OperationObject,
    });

    expect(data).toMatchObject({
      name: "GetPetFrame",
      filePath: "GetPetFrame.ts",
      tag: "pet",
      parentFrame: "JinFrame",
      responseTypeMappedAccessPath: "['/pets/{petId}']['get']['responses']['200']['content']['application/json']",
      decorators: [
        {
          name: "Get",
          arguments: ["{ host: 'https://api.example.com', path: '/pets/{petId}' }"],
        },
        {
          name: "Timeout",
          arguments: ["3000"],
        },
        {
          name: "Retry",
          arguments: ["{ max: 3, interval: 500 }"],
        },
      ],
    });
    expect(data.imports.at(0)).toEqual({
      moduleSpecifier: "jin-frame",
      namedImports: ["Get", "Param", "Timeout", "Retry", "JinFrame"],
    });
    expect(data.properties).toHaveLength(1);
  });
});
