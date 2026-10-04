import { expectTypeOf, it } from "vitest";
import type { IGeneratedFile } from "#commands/write-generated-files/IGeneratedFile.js";

it("should describe a generated file", () => {
  expectTypeOf<IGeneratedFile>().toEqualTypeOf<{ relativePath: string; source: string }>();
});
