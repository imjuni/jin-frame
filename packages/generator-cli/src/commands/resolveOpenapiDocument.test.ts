import { load } from "@jin-frame/generator-core";
import pathe from "pathe";
import { describe, expect, it } from "vitest";
import { resolveOpenapiDocument } from "#commands/resolveOpenapiDocument.js";

describe("resolveOpenapiDocument", () => {
  it("should convert swagger v2 document before returning resolved document", async () => {
    const filePath = pathe.join(process.cwd(), "..", "..", "examples", "openapi", "v2.json");
    const loaded = await load(filePath);

    const resolved = await resolveOpenapiDocument(loaded?.data, filePath);

    expect(resolved.version).toBe(3);
    expect(resolved.document.openapi).toBe("3.0.0");
  });

  it("should resolve an OpenAPI 3.1 document", async () => {
    const resolved = await resolveOpenapiDocument(
      {
        openapi: "3.1.0",
        info: { title: "OpenAPI 3.1 test", version: "1.0.0" },
        paths: {},
        components: { schemas: { Value: { type: ["string", "null"] } } },
      },
      "openapi-3.1.json",
    );

    expect(resolved.version).toBe(3);
    expect(resolved.document.openapi).toBe("3.1.0");
  });
});
