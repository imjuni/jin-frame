import { describe, expect, it } from "vitest";
import { createBaseFrameData } from "#generators/base-frame/createBaseFrameData.js";

describe("createBaseFrameData", () => {
  it("should convert server host options into base frame data", () => {
    const data = createBaseFrameData({
      output: "/a/b",
      host: "https://{tenant}.api.example.com",
      pathPrefix: "/v{version}",
      name: "ServerHostFrame",
      timeout: 3000,
      serverVariables: {
        tenant: {
          default: "dev",
          description: "Tenant subdomain",
        },
        version: {
          default: "1",
          enum: ["1", "2"],
        },
      },
    });

    expect(data).toMatchObject({
      name: "ServerHostFrame",
      filePath: "ServerHostFrame.ts",
      extends: "JinFrame<SUCCESS, FAIL>",
      imports: [
        {
          moduleSpecifier: "jin-frame",
          namedImports: ["Get", "Param", "JinFrame", "Timeout"],
        },
      ],
      decorators: [
        {
          name: "Get",
          arguments: ["{ host: 'https://{tenant}.api.example.com', pathPrefix: '/v{version}' }"],
        },
        {
          name: "Timeout",
          arguments: ["3000"],
        },
      ],
    });
    expect(data.properties).toHaveLength(2);
    expect(data.methods).toHaveLength(1);
  });
});
