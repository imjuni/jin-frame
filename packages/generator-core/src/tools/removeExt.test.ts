import { describe, expect, it } from "vitest";
import { removeExt } from "#/tools/removeExt";

describe("removeExt", () => {
  it("should remove double extension when file has .d.ts extension", () => {
    expect(removeExt("test.d.ts")).toEqual("test");
  });

  it("should remove single extension when file has regular extension", () => {
    expect(removeExt("test.js")).toEqual("test");
  });

  it("should return original path when file has no extension", () => {
    expect(removeExt("/a/b/schema")).toEqual("/a/b/schema");
  });
});
