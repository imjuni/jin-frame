import fs from "node:fs";
import os from "node:os";
import pathe from "pathe";
import { afterEach, describe, expect, it } from "vitest";
import { assertNoSymlink } from "#commands/write-generated-files/assertNoSymlink.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => fs.promises.rm(directory, { recursive: true })));
});

describe("assertNoSymlink", () => {
  it("should accept regular and missing directories", async () => {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-symlink-"));
    temporaryDirectories.push(output);

    await expect(assertNoSymlink(output, pathe.join(output, "frames/PetFrame.ts"))).resolves.toBeUndefined();
  });

  it("should reject a symbolic link in the target path", async () => {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-symlink-"));
    const external = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-external-"));
    temporaryDirectories.push(output, external);
    await fs.promises.symlink(external, pathe.join(output, "frames"));

    await expect(assertNoSymlink(output, pathe.join(output, "frames/PetFrame.ts"))).rejects.toThrow(
      "Generated file path contains a symbolic link",
    );
  });
});
