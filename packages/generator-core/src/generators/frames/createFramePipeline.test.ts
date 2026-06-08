import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { createFrameGenerationContext } from "#generators/frames/createFrameGenerationContext.js";
import { createFramePipeline } from "#generators/frames/createFramePipeline.js";

describe("createFramePipeline", () => {
  it("should create base frame and endpoint frames from context", () => {
    const params = {
      specTypeFilePath: "/a/b/paths.d.ts",
      output: "/a/b",
      baseFrame: "ServerHostFrame",
      useCodeFence: false,
      document: {} as OpenAPIV3.Document,
    };
    const document = {
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      servers: [{ url: "https://api.example.com/v1" }],
      paths: {
        "/users": {
          get: {
            operationId: "listUsers",
            responses: { "200": { description: "Success" } },
          },
        },
      },
    } satisfies OpenAPIV3.Document;

    const frames = createFramePipeline({
      params: { ...params, document },
      context: createFrameGenerationContext({ ...params, document }, document),
    });

    expect(frames).toHaveLength(2);
    expect(frames.at(0)?.frame.filePath).toBe("ServerHostFrame.ts");
    expect(frames.at(1)).toMatchObject({
      method: "get",
      pathKey: "/users",
    });
    expect(frames.at(1)?.frame.filePath).toBe("ListUsersFrame.ts");
  });
});
