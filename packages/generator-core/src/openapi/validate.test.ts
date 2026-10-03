import { describe, expect, it } from "vitest";
import { validate } from "#openapi/validate.js";

describe("validate", () => {
  it("should validate an OpenAPI v3 document", () => {
    const result = validate({
      openapi: "3.0.0",
      info: {
        title: "Package smoke test",
        version: "1.0.0",
      },
      paths: {},
    });

    expect(result.valid).toBe(true);
    expect(result.version).toBe(3);
  });

  it("should validate an OpenAPI 3.1 document", () => {
    const result = validate({
      openapi: "3.1.0",
      info: { title: "OpenAPI 3.1 test", version: "1.0.0" },
      paths: {},
      components: { schemas: { Value: { type: ["string", "null"] } } },
    });

    expect(result.valid).toBe(true);
    expect(result.version).toBe(3);
  });
});
