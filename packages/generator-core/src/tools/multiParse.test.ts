import { describe, expect, it } from "vitest";
import { multiParse } from "#tools/multiParse.js";

describe("multiParse", () => {
  it("should return the parsed value when the value is JSON", () => {
    const result = multiParse<{ a: number }>('{"a": 1}');
    expect(result).toEqual({ kind: "json", data: { a: 1 } });
  });

  it("should return the parsed value when the value is YAML", () => {
    const result = multiParse<{ a: number }>("a: 1");
    expect(result).toEqual({ kind: "yaml", data: { a: 1 } });
  });

  it("should return undefined when the value is not valid JSON or YAML", () => {
    const result = multiParse<{ a: number }>("{]");
    expect(result).toBeUndefined();
  });
});
