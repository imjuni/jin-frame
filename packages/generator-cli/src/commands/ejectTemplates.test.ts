import { loadTemplates } from "@jin-frame/generator-core";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { ejectTemplates } from "#commands/ejectTemplates.js";

it("should export defaults and preserve existing templates when ejecting repeatedly", async () => {
  const root = await mkdtemp(join(tmpdir(), "template-eject-"));
  const directory = join(root, "templates");
  try {
    await ejectTemplates(directory);
    for (const [name, content] of Object.entries(await loadTemplates())) {
      expect(await readFile(join(directory, `${name}.eta`), "utf8")).toBe(content);
    }
    await writeFile(join(directory, "frame.eta"), "custom");
    await rm(join(directory, "base-frame.eta"));
    await ejectTemplates(directory);
    expect(await readFile(join(directory, "frame.eta"), "utf8")).toBe("custom");
    expect(await readFile(join(directory, "base-frame.eta"), "utf8")).toBe((await loadTemplates())["base-frame"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
