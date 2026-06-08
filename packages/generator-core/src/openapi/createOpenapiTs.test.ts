import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { createOpenapiTs } from "#openapi/createOpenapiTs.js";
import { renderOpenapiTs } from "#renderers/renderOpenapiTs.js";

describe("createOpenapiTs", () => {
  const document = {
    openapi: "3.0.0",
    info: { title: "Test API", version: "1.0.0" },
    paths: {
      "/orders": {
        post: {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id", "nested", "items"],
                  properties: {
                    id: { type: "integer", format: "int64" },
                    legacyId: { type: "integer", format: "i64" },
                    count: { type: "integer", format: "int32" },
                    nested: {
                      type: "object",
                      required: ["id"],
                      properties: {
                        id: { type: "integer", format: "int64" },
                      },
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["id"],
                        properties: {
                          id: { type: "integer", format: "int64" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer", format: "int64" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ComponentOrder: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
          },
        },
      },
    },
  } satisfies OpenAPIV3.Document;

  it("should map int64 and i64 integer schemas to string when enabled", async () => {
    const source = renderOpenapiTs(await createOpenapiTs(document, { int64AsString: true, silent: true }));

    expect(source).toContain("id: string;");
    expect(source).toContain("legacyId?: string;");
    expect(source).toContain("count?: number;");
    expect(source).toMatch(/nested: \{[\s\S]*id: string;[\s\S]*};/);
    expect(source).toMatch(/items: \{[\s\S]*id: string;[\s\S]*}\[];/);
    expect(source).toMatch(/ComponentOrder: \{[\s\S]*id\?: string;[\s\S]*};/);
  });

  it("should keep openapi-typescript integer mapping when int64 string mapping is disabled", async () => {
    const source = renderOpenapiTs(await createOpenapiTs(document, { int64AsString: false, silent: true }));

    expect(source).toContain("id: number;");
    expect(source).toContain("legacyId?: number;");
  });
});
