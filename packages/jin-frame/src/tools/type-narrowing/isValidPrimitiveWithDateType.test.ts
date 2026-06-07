import { describe, expect, it } from "vitest";
import { isValidPrimitiveWithDateType } from "#tools/type-narrowing/isValidPrimitiveWithDateType";

describe("isValidPrimitiveWithDateType", () => {
  it("string type", () => {
    const r = isValidPrimitiveWithDateType("a");
    expect(r).toBeTruthy();
  });

  it("number type", () => {
    const r = isValidPrimitiveWithDateType(1);
    expect(r).toBeTruthy();
  });

  it("boolean type", () => {
    const r = isValidPrimitiveWithDateType(1);
    expect(r).toBeTruthy();
  });

  it("date object", () => {
    const r = isValidPrimitiveWithDateType(new Date());
    expect(r).toBeTruthy();
  });

  it("plain object", () => {
    const r = isValidPrimitiveWithDateType({ name: "ironman" });
    expect(r).toBeFalsy();
  });
});
