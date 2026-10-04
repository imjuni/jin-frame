import pathe from "pathe";
import { describe, expect, it } from "vitest";
import { resolveOutputPath } from "#commands/write-generated-files/resolveOutputPath.js";

describe("resolveOutputPath", () => {
  it("should resolve a path inside the output directory", () => {
    expect(resolveOutputPath("/tmp/output", "frames/PetFrame.ts")).toBe(
      pathe.resolve("/tmp/output/frames/PetFrame.ts"),
    );
  });

  it.each(["", "../outside.ts", "/tmp/outside.ts"])("should reject an escaping path: %s", (relativePath) => {
    expect(() => resolveOutputPath("/tmp/output", relativePath)).toThrow(
      "Generated file path escapes the output directory",
    );
  });
});
