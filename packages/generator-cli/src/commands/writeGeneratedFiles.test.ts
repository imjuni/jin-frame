import fs from "node:fs";
import os from "node:os";
import pathe from "pathe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { writeGeneratedFiles } from "#commands/writeGeneratedFiles.js";

describe("writeGeneratedFiles", () => {
  const directories: string[] = [];

  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(directories.splice(0).map((directory) => fs.promises.rm(directory, { recursive: true })));
  });

  async function createOutput(): Promise<string> {
    const output = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-output-"));
    directories.push(output);
    return output;
  }

  it("should reject paths outside the output directory before writing files", async () => {
    const output = await createOutput();

    await expect(writeGeneratedFiles(output, [{ relativePath: "../outside.ts", source: "unsafe" }])).rejects.toThrow(
      "escapes the output directory",
    );
    await expect(fs.promises.readFile(pathe.join(output, "../outside.ts"))).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("should reject duplicate generated file paths", async () => {
    const output = await createOutput();

    await expect(
      writeGeneratedFiles(output, [
        { relativePath: "PetFrame.ts", source: "first" },
        { relativePath: "petframe.ts", source: "second" },
      ]),
    ).rejects.toThrow("Generated file path collision: petframe.ts");
  });

  it("should remove stale generated files without removing user files", async () => {
    const output = await createOutput();
    await fs.promises.writeFile(pathe.join(output, "user.ts"), "user");
    await writeGeneratedFiles(output, [{ relativePath: "OldFrame.ts", source: "old" }]);
    await writeGeneratedFiles(output, [{ relativePath: "NewFrame.ts", source: "new" }]);

    await expect(fs.promises.readFile(pathe.join(output, "OldFrame.ts"))).rejects.toMatchObject({ code: "ENOENT" });
    await expect(fs.promises.readFile(pathe.join(output, "NewFrame.ts"), "utf8")).resolves.toBe("new");
    await expect(fs.promises.readFile(pathe.join(output, "user.ts"), "utf8")).resolves.toBe("user");
  });

  it("should restore existing files when committing a staged file fails", async () => {
    const output = await createOutput();
    await writeGeneratedFiles(output, [
      { relativePath: "FirstFrame.ts", source: "first-old" },
      { relativePath: "SecondFrame.ts", source: "second-old" },
    ]);

    const rename = fs.promises.rename.bind(fs.promises);
    vi.spyOn(fs.promises, "rename").mockImplementation(async (source, destination) => {
      if (source.toString().includes("/staged/SecondFrame.ts")) {
        throw new Error("simulated commit failure");
      }
      return rename(source, destination);
    });

    await expect(
      writeGeneratedFiles(output, [
        { relativePath: "FirstFrame.ts", source: "first-new" },
        { relativePath: "SecondFrame.ts", source: "second-new" },
      ]),
    ).rejects.toThrow("simulated commit failure");

    await expect(fs.promises.readFile(pathe.join(output, "FirstFrame.ts"), "utf8")).resolves.toBe("first-old");
    await expect(fs.promises.readFile(pathe.join(output, "SecondFrame.ts"), "utf8")).resolves.toBe("second-old");
  });
});
