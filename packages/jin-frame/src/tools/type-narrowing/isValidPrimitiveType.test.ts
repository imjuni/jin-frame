import { describe, expect, it } from "vitest";
import { isValidPrimitiveType } from "#tools/type-narrowing/isValidPrimitiveType";

describe("isValidPrimitiveType", () => {
  it("string type", () => {
    const r = isValidPrimitiveType("a");
    expect(r).toBeTruthy();
  });

  it("number type", () => {
    const r = isValidPrimitiveType(1);
    expect(r).toBeTruthy();
  });

  it("boolean type", () => {
    const r = isValidPrimitiveType(1);
    expect(r).toBeTruthy();
  });

  it("date object", () => {
    const r = isValidPrimitiveType(new Date());
    expect(r).toBeFalsy();
  });

  it("plain object", () => {
    const r = isValidPrimitiveType({ name: "ironman" });
    expect(r).toBeFalsy();
  });
});
