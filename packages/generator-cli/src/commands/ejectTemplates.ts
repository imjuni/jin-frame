import { loadTemplates } from "@jin-frame/generator-core";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function ejectTemplates(directory = resolve("templates")): Promise<void> {
  const templates = await loadTemplates();
  await mkdir(directory, { recursive: true });
  for (const [name, content] of Object.entries(templates)) {
    const path = resolve(directory, `${name}.eta`);
    try {
      await writeFile(path, content, { encoding: "utf8", flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw new Error(`Failed to eject template: ${path}`, { cause: error });
      }
    }
  }
}
