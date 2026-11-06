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
      responseTypes: ["OperationResponse"],
      typeAliases: [
        {
          name: "OperationResponse",
          type: `{ status: 200; data: paths['/pets/{petId}']['get']['responses'][200]['content']["application/json"] }`,
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

  it("should generate a response union when only an error response exists", () => {
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
      responseTypes: ["OperationResponse"],
      typeAliases: [
        {
          name: "OperationResponse",
          type: `{ status: 405; data: paths['/pet']['post']['responses'][405]['content']["application/json"] }`,
        },
        {
          name: "FrameRequestBody",
          type: "NonNullable<paths['/pet']['post']['requestBody']>['content']['application/json']",
        },
      ],
    });
  });

  it("should use undefined data when an error response has no body", () => {
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
          },
        },
      } satisfies OpenAPIV3.OperationObject,
    });

    expect(data).toMatchObject({
      name: "AddPetFrame",
      parentFrame: "ServerHostFrame",
      responseTypes: ["OperationResponse"],
      typeAliases: [
        {
          name: "OperationResponse",
          type: `{ status: 405; data: undefined }`,
        },
        {
          name: "FrameRequestBody",
          type: "NonNullable<paths['/pet']['post']['requestBody']>['content']['application/json']",
        },
      ],
    });
  });
});

it("should include every numeric response status when generating an operation union", () => {
  const data = createFrameData({
    specTypeFilePath: "/a/b/paths.d.ts",
    host: "https://api.example.com",
    output: "/a/b",
    pathKey: "/pets",
    method: "get",
    operation: {
      responses: Object.fromEntries(
        [200, 201, 302, 400, 500].map((status) => [
          status,
          {
            description: "Response",
            content: { "application/json": { schema: { type: "object" as const } } },
          },
        ]),
      ),
    },
  });
  const response = data.typeAliases.find((alias) => alias.name === "OperationResponse");
  for (const status of [200, 201, 302, 400, 500]) {
    expect(response?.type).toContain(`{ status: ${status}; data: paths['/pets']['get']['responses'][${status}]`);
  }
  expect(response?.type.split(" | ")).toHaveLength(5);
});
