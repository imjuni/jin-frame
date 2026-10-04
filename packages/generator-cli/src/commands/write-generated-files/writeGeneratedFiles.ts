import crypto from "node:crypto";
import fs from "node:fs";
import pathe from "pathe";
import { assertNoSymlink } from "#commands/write-generated-files/assertNoSymlink.js";
import type { IGeneratedFile } from "#commands/write-generated-files/IGeneratedFile.js";
import type { IWriteGeneratedFilesOptions } from "#commands/write-generated-files/IWriteGeneratedFilesOptions.js";
import { loadManifest } from "#commands/write-generated-files/loadManifest.js";
import { manifestFileName } from "#commands/write-generated-files/manifestFileName.js";
import { resolveOutputPath } from "#commands/write-generated-files/resolveOutputPath.js";

export async function writeGeneratedFiles(
  output: string,
  files: IGeneratedFile[],
  options?: IWriteGeneratedFilesOptions,
): Promise<void> {
  const normalized = files.map((file) => ({ ...file, relativePath: pathe.normalize(file.relativePath) }));
  const reserved = normalized.find(
    (file) => file.relativePath === manifestFileName || file.relativePath.startsWith(".frame-cli-"),
  );
  if (reserved != null) {
    throw new Error(`Generated file path is reserved: "${reserved.relativePath}"`);
  }
  const collisionKeys = normalized.map((file) => file.relativePath.toLocaleLowerCase("en-US"));
  const duplicates = normalized
    .map((file) => file.relativePath)
    .filter((_, index) => collisionKeys.indexOf(collisionKeys[index] ?? "") !== index);

  if (duplicates.length > 0) {
    throw new Error(`Generated file path collision: ${Array.from(new Set(duplicates)).join(", ")}`);
  }

  await fs.promises.mkdir(output, { recursive: true });
  const targets = normalized.map((file) => ({ ...file, target: resolveOutputPath(output, file.relativePath) }));
  for (const file of targets) {
    await assertNoSymlink(output, file.target);
  }

  const previous = await loadManifest(output);
  const preserved = new Set(options?.preservePreviousPaths ?? []);
  const nextPaths = new Set([
    ...normalized.map((file) => file.relativePath),
    ...previous.filter((filePath) => preserved.has(filePath)),
  ]);
  const stale = previous.filter((filePath) => !nextPaths.has(filePath));
  const transactionDir = pathe.join(output, `.frame-cli-${crypto.randomUUID()}`);
  const stagedDir = pathe.join(transactionDir, "staged");
  const backupDir = pathe.join(transactionDir, "backup");
  const committed: string[] = [];
  const backedUp: Array<{ backup: string; target: string }> = [];

  try {
    for (const file of targets) {
      const staged = pathe.join(stagedDir, file.relativePath);
      await fs.promises.mkdir(pathe.dirname(staged), { recursive: true });
      await fs.promises.writeFile(staged, file.source);
    }

    const manifestSource = `${JSON.stringify(Array.from(nextPaths).sort(), null, 2)}\n`;
    await fs.promises.mkdir(stagedDir, { recursive: true });
    await fs.promises.writeFile(pathe.join(stagedDir, manifestFileName), manifestSource);

    const pathsToReplace = [...targets.map((file) => file.relativePath), manifestFileName, ...stale];
    for (const relativePath of Array.from(new Set(pathsToReplace))) {
      const target = resolveOutputPath(output, relativePath);
      try {
        await fs.promises.lstat(target);
        const backup = pathe.join(backupDir, relativePath);
        await fs.promises.mkdir(pathe.dirname(backup), { recursive: true });
        await fs.promises.rename(target, backup);
        backedUp.push({ backup, target });
      } catch (caught) {
        if ((caught as NodeJS.ErrnoException).code !== "ENOENT") {
          throw caught;
        }
      }
    }

    for (const relativePath of [...targets.map((file) => file.relativePath), manifestFileName]) {
      const staged = pathe.join(stagedDir, relativePath);
      const target = resolveOutputPath(output, relativePath);
      await fs.promises.mkdir(pathe.dirname(target), { recursive: true });
      await fs.promises.rename(staged, target);
      committed.push(target);
    }
  } catch (caught) {
    await Promise.all(committed.map((target) => fs.promises.rm(target, { force: true })));
    for (const entry of backedUp.reverse()) {
      await fs.promises.mkdir(pathe.dirname(entry.target), { recursive: true });
      await fs.promises.rename(entry.backup, entry.target);
    }
    throw caught;
  } finally {
    await fs.promises.rm(transactionDir, { recursive: true, force: true });
  }
}
