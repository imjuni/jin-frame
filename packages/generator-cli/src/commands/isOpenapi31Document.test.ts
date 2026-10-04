import { describe, expect, it } from "vitest";
import { isOpenapi31Document } from "#commands/isOpenapi31Document.js";

describe("isOpenapi31Document", () => {
  it.each(["3.1.0", "3.1.1"])("should accept OpenAPI %s documents", (openapi) => {
    expect(isOpenapi31Document({ openapi })).toBe(true);
  });

  it.each([null, {}, { openapi: "3.0.4" }, { openapi: 3.1 }])("should reject non OpenAPI 3.1 values", (value) => {
    expect(isOpenapi31Document(value)).toBe(false);
  });
});
