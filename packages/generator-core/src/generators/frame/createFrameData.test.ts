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
      responseTypes: ["SuccessResponse"],
      typeAliases: [
        {
          name: "SuccessResponse",
          type: "paths['/pets/{petId}']['get']['responses']['200']['content']['application/json']",
        },
        {
          name: "FrameRequestParameter",
          type: "paths['/pets/{petId}']['get']['parameters']['path']",
        },
      ],
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

  it("should use void success and fail response type when only fail response content exists", () => {
    const data = createFrameData({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      pathKey: "/pet",
      method: "post",
      operation: {
        operationId: "addPet",
        tags: ["pet"],
        requestBody: {
          description: "Pet object that needs to be added to the store",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          "405": {
            description: "Invalid input",
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
      name: "AddPetFrame",
      parentFrame: "ServerHostFrame",
      responseTypes: ["void", "FailResponse"],
      typeAliases: [
        {
          name: "FailResponse",
          type: "paths['/pet']['post']['responses']['405']['content']['application/json']",
        },
        {
          name: "FrameRequestBody",
          type: "NonNullable<paths['/pet']['post']['requestBody']>['content']['application/json']",
        },
      ],
    });
  });
});
