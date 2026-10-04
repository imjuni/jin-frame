import { expectTypeOf, it } from "vitest";
import type { IWriteGeneratedFilesOptions } from "#commands/write-generated-files/IWriteGeneratedFilesOptions.js";

it("should describe generated file write options", () => {
  expectTypeOf<IWriteGeneratedFilesOptions>().toEqualTypeOf<{ preservePreviousPaths?: string[] }>();
});
