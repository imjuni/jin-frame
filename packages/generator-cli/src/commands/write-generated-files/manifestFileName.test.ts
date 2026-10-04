import { expect, it } from "vitest";
import { manifestFileName } from "#commands/write-generated-files/manifestFileName.js";

it("should use the reserved generator manifest name", () => {
  expect(manifestFileName).toBe(".frame-cli-manifest.json");
});
