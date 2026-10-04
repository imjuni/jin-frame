import fs from "node:fs";
import os from "node:os";
import pathe from "pathe";
import { afterEach, describe, expect, it } from "vitest";
import { loadManifest } from "#commands/write-generated-files/loadManifest.js";
import { manifestFileName } from "#commands/write-generated-files/manifestFileName.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => fs.promises.rm(directory, { recursive: true })));
});

describe("loadManifest", () => {
  it("should return an empty list when the manifest does not exist", async () => {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-manifest-"));
    temporaryDirectories.push(output);

    await expect(loadManifest(output)).resolves.toEqual([]);
  });

  it("should load a string path list", async () => {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-manifest-"));
    temporaryDirectories.push(output);
    await fs.promises.writeFile(pathe.join(output, manifestFileName), JSON.stringify(["PetFrame.ts"]));

    await expect(loadManifest(output)).resolves.toEqual(["PetFrame.ts"]);
  });

  it("should ignore a manifest with an invalid shape", async () => {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-manifest-"));
    temporaryDirectories.push(output);
    await fs.promises.writeFile(pathe.join(output, manifestFileName), JSON.stringify([1]));

    await expect(loadManifest(output)).resolves.toEqual([]);
  });
});
