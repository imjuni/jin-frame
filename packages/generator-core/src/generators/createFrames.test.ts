import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { createFrames } from "#generators/createFrames.js";

describe("createFrames", async () => {
  const { default: document } = (await import("../../../../examples/openapi/v3.json")) as unknown as {
    default: OpenAPIV3.Document;
  };

  it("should return variety frame when pass v3 document", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/c",
      host: "https://pokeapi.co",
      output: "/a/b",
      useCodeFence: true,
      document,
    });
    expect(frames.length).toBeGreaterThan(0);
  });

  it("should include path-level parameters in operation frames", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://pokeapi.co",
      output: "/a/b",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/users/{userId}": {
            parameters: [
              {
                name: "userId",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
              {
                name: "session",
                in: "cookie",
                schema: { type: "string" },
              },
            ],
            get: {
              operationId: "getUser",
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
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    expect(frames).toHaveLength(1);
    const frame = frames.at(0);
    expect(frame?.frame.source).toContain('import { Get, Param, Cookie, JinFrame } from "jin-frame";');
    expect(frame?.frame.source).toContain("@Param()");
    expect(frame?.frame.source).toContain("@Cookie()");
  });

  it("should create server host frame and inherit endpoint frames from it", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      specFilePath: "https://docs.example.com/openapi.json",
      host: undefined,
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        servers: [{ url: "https://api.example.com/v1" }],
        paths: {
          "/users/{userId}": {
            get: {
              operationId: "getUser",
              parameters: [
                {
                  name: "userId",
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
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    expect(frames).toHaveLength(2);
    expect(frames.at(0)?.frame.filePath).toBe("ServerHostFrame.ts");
    expect(frames.at(0)?.frame.source).toContain("@Get({ host: 'https://api.example.com', pathPrefix: '/v1' })");
    expect(frames.at(1)?.frame.source).toContain('import { ServerHostFrame } from "./ServerHostFrame.js";');
    expect(frames.at(1)?.frame.source).toContain("@Get({ path: '/users/{userId}' })");
    expect(frames.at(1)?.frame.source).toContain(
      "type SuccessResponse = paths['/users/{userId}']['get']['responses']['200']['content']['application/json'];",
    );
    expect(frames.at(1)?.frame.source).toContain(
      "type FrameRequestParameter = paths['/users/{userId}']['get']['parameters']['path'];",
    );
    expect(frames.at(1)?.frame.source).toContain("export class GetUserFrame extends ServerHostFrame<SuccessResponse>");
  });

  it("should create server variable parameters on server host frame", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        servers: [
          {
            url: "https://{tenant}.api.example.com/v{version}",
            variables: {
              tenant: {
                default: "dev",
                description: "Tenant subdomain",
              },
              version: {
                default: "1",
                enum: ["1", "2"],
              },
            },
          },
        ],
        paths: {
          "/users": {
            get: {
              operationId: "listUsers",
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    const serverHostFrame = frames.at(0)?.frame.source;

    expect(serverHostFrame).toContain('import { Get, Param, JinFrame, Timeout } from "jin-frame";');
    expect(serverHostFrame).toContain("@Get({ host: 'https://{tenant}.api.example.com', pathPrefix: '/v{version}' })");
    expect(serverHostFrame).toContain("@Param()");
    expect(serverHostFrame).toContain("declare public readonly tenant?: string;");
    expect(serverHostFrame).toContain("declare public readonly version?: '1' | '2';");
    expect(serverHostFrame).toContain("protected static override getDefaultValues(): Partial<ServerHostFrame>");
    expect(serverHostFrame).toContain('return { "tenant": "dev", "version": "1" };');
  });

  it("should apply endpoint overrides by OpenAPI path key", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      overrides: {
        hosts: {
          "/pets/{petId}": "https://override.example.com",
        },
        retries: {
          "/pets/{petId}": {
            max: 3,
            interval: 500,
          },
        },
        timeouts: {
          "/pets/{petId}": 3000,
        },
      },
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/pets/{petId}": {
            get: {
              operationId: "getPet",
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    const frame = frames.at(1)?.frame.source;

    expect(frame).toContain('import { Get, Timeout, Retry } from "jin-frame";');
    expect(frame).toContain("@Get({ host: 'https://override.example.com', path: '/pets/{petId}' })");
    expect(frame).toContain("@Timeout(3000)");
    expect(frame).toContain("@Retry({ max: 3, interval: 500 })");
  });

  it("should render fail response type separately when operation has no success response content", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/pet": {
            post: {
              operationId: "addPet",
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
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    const frame = frames.at(1)?.frame.source;

    expect(frame).toContain(
      "type FailResponse = paths['/pet']['post']['responses']['405']['content']['application/json'];",
    );
    expect(frame).toContain("export class AddPetFrame extends ServerHostFrame<void, FailResponse>");
  });

  it("should render void fail response type when fail response has no content", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/pet": {
            post: {
              operationId: "addPet",
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
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    const frame = frames.at(1)?.frame.source;

    expect(frame).not.toContain("type FailResponse");
    expect(frame).toContain("export class AddPetFrame extends ServerHostFrame<void, void>");
  });

  it("should generate security providers and apply root security to frames", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
            apiKey: {
              type: "apiKey",
              in: "header",
              name: "X-API-Key",
            },
          },
        },
        security: [{ bearerAuth: [], apiKey: [] }],
        paths: {
          "/users": {
            get: {
              operationId: "listUsers",
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    expect(frames.map((frame) => frame.frame.filePath)).toEqual([
      "ServerHostFrame.ts",
      "BearerAuthProvider.ts",
      "ApiKeySecurityProvider.ts",
      "ListUsersFrame.ts",
    ]);
    expect(frames.at(1)?.frame.source).toContain('import { BearerTokenProvider } from "jin-frame";');
    expect(frames.at(1)?.frame.source).toContain("export class BearerAuthProvider extends BearerTokenProvider");
    expect(frames.at(1)?.frame.source).toContain('super("bearerAuth");');
    expect(frames.at(2)?.frame.source).toContain('import { ApiKeyProvider } from "jin-frame";');
    expect(frames.at(2)?.frame.source).toContain("export class ApiKeySecurityProvider extends ApiKeyProvider");
    expect(frames.at(2)?.frame.source).toContain('super("apiKey", "X-API-Key", "header");');
    expect(frames.at(3)?.frame.source).toContain(
      'import { BearerAuthProvider } from "./securities/BearerAuthProvider.js";',
    );
    expect(frames.at(3)?.frame.source).toContain(
      'import { ApiKeySecurityProvider } from "./securities/ApiKeySecurityProvider.js";',
    );
    expect(frames.at(3)?.frame.source).toContain(
      "@Get({ path: '/users', security: [new BearerAuthProvider(), new ApiKeySecurityProvider()] })",
    );
  });

  it("should use configured external security provider imports", async () => {
    const frames = await createFrames({
      specTypeFilePath: "/a/b/paths.d.ts",
      host: "https://api.example.com",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      securityProviders: {
        bearerAuth: {
          className: "AppBearerTokenProvider",
          importPath: "@/auth/AppBearerTokenProvider",
        },
      },
      document: {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
        paths: {
          "/users": {
            get: {
              operationId: "listUsers",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      } satisfies OpenAPIV3.Document,
    });

    expect(frames.map((frame) => frame.frame.filePath)).toEqual(["ServerHostFrame.ts", "ListUsersFrame.ts"]);
    expect(frames.at(1)?.frame.source).toContain(
      'import { AppBearerTokenProvider } from "@/auth/AppBearerTokenProvider";',
    );
    expect(frames.at(1)?.frame.source).toContain("@Get({ path: '/users', security: new AppBearerTokenProvider() })");
  });
});
