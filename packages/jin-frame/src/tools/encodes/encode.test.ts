import { describe, expect, it } from "vitest";
import { encodes } from "#tools/encodes/encodes";

describe("encode", () => {
  it("should successfully encode", () => {
    const encoded = encodes(true, "😄");
    const expected = "%F0%9F%98%84";
    expect(encoded).toEqual(expected);
  });
});
