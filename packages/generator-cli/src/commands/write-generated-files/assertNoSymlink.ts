import fs from "node:fs";
import pathe from "pathe";

export async function assertNoSymlink(output: string, target: string): Promise<void> {
  const root = pathe.resolve(output);
  const relativeParts = pathe.relative(root, pathe.dirname(target)).split("/").filter(Boolean);
  let current = root;

  for (const part of relativeParts) {
    current = pathe.join(current, part);
    try {
      const stat = await fs.promises.lstat(current);
      if (stat.isSymbolicLink()) {
        throw new Error(`Generated file path contains a symbolic link: "${current}"`);
      }
    } catch (caught) {
      if ((caught as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }
      throw caught;
    }
  }
}
