import fs from "node:fs";
import pathe from "pathe";
import { manifestFileName } from "#commands/write-generated-files/manifestFileName.js";

export async function loadManifest(output: string): Promise<string[]> {
  try {
    const source = await fs.promises.readFile(pathe.join(output, manifestFileName), "utf8");
    const parsed: unknown = JSON.parse(source);
    return Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string") ? parsed : [];
  } catch (caught) {
    if ((caught as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw caught;
  }
}
