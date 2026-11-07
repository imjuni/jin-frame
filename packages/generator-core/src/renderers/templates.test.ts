import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { defaultTemplates, loadTemplates } from "#renderers/templates.js";

it("should override one template when other files are missing", async () => {
  const directory = await mkdtemp(join(tmpdir(), "jin-templates-"));
  try {
    await writeFile(join(directory, "frame.eta"), "custom");
    const templates = await loadTemplates(directory);
    expect(templates.frame).toBe("custom");
    expect(templates["base-frame"]).toBe(defaultTemplates["base-frame"]);
    expect(defaultTemplates.frame).not.toBe("custom");
    expect(await loadTemplates(join(directory, "missing"))).toEqual(defaultTemplates);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

it("should reject unreadable template entries when a template path is a directory", async () => {
  const { mkdir } = await import("node:fs/promises");
  const root = await mkdtemp(join(tmpdir(), "invalid-template-"));
  try {
    await mkdir(join(root, "frame.eta"));
    await expect(loadTemplates(root)).rejects.toThrow("Failed to load template");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
