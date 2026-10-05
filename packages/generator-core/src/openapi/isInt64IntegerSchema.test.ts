import { describe, expect, it } from "vitest";
import { isInt64IntegerSchema } from "#openapi/isInt64IntegerSchema.js";

describe("isInt64IntegerSchema", () => {
  it.each([
    { type: "integer", format: "int64" },
    { type: ["integer", "null"], format: "I64" },
  ])("should accept int64 integer schemas", (schema) => {
    expect(isInt64IntegerSchema(schema)).toBe(true);
  });

  it.each([null, [], { type: "integer", format: "int32" }, { type: "string", format: "int64" }])(
    "should reject non int64 integer schemas",
    (schema) => {
      expect(isInt64IntegerSchema(schema)).toBe(false);
    },
  );
});
