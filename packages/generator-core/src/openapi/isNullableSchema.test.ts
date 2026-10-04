import { describe, expect, it } from "vitest";
import { isNullableSchema } from "#openapi/isNullableSchema.js";

describe("isNullableSchema", () => {
  it.each([{ nullable: true }, { type: ["integer", "null"] }])("should accept nullable schemas", (schema) => {
    expect(isNullableSchema(schema)).toBe(true);
  });

  it.each([null, [], {}, { nullable: false }, { type: "null" }])("should reject non nullable schemas", (schema) => {
    expect(isNullableSchema(schema)).toBe(false);
  });
});
