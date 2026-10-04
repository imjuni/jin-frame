import { describe, expect, it } from "vitest";
import { isSwaggerV2Document } from "#commands/isSwaggerV2Document.js";

describe("isSwaggerV2Document", () => {
  it("should accept Swagger 2.0 documents", () => {
    expect(isSwaggerV2Document({ swagger: "2.0" })).toBe(true);
  });

  it.each([null, {}, { swagger: "1.2" }, { openapi: "3.0.0" }])("should reject non Swagger 2.0 values", (value) => {
    expect(isSwaggerV2Document(value)).toBe(false);
  });
});
