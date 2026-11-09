import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { createCommandRun } from "#commands/createCommandRun.js";
import { frameCommandRun } from "#commands/frameCommandRun.js";
import { createCommand } from "#commands/createCommand.js";
import { frameCommand } from "#commands/frameCommand.js";
import { templateEjectCommand } from "#commands/templateEjectCommand.js";
import { getCoercePath } from "#validators/getCoercePath.js";
import { coercePathOrUrl } from "#validators/coercePathOrUrl.js";

it("should generate types and frames with events when running CLI commands", async () => {
  const dir = await mkdtemp(join(tmpdir(), "command-runs-"));
  try {
    const spec = join(dir, "spec.json");
    const output = join(dir, "output");
    await writeFile(
      spec,
      JSON.stringify({
        openapi: "3.0.3",
        info: { title: "Test", version: "1" },
        servers: [{ url: "https://example.com" }],
        paths: { "/pets": { get: { operationId: "listPets", responses: { "200": { description: "OK" } } } } },
      }),
    );
    await createCommandRun({ args: { spec, output, "log-level": "error" } } as Parameters<typeof createCommandRun>[0]);
    expect(await readFile(join(output, "paths.d.ts"), "utf8")).toContain("/pets");
    await frameCommandRun({
      args: { spec, output, type: join(output, "paths.d.ts"), "log-level": "error" },
    } as Parameters<typeof frameCommandRun>[0]);
    expect(await readFile(join(output, "paths.d.ts"), "utf8")).toContain("/pets");
    expect(coercePathOrUrl(spec)).toBe(spec);
    expect(coercePathOrUrl("https://example.com/spec.json")).toContain("example.com");
    expect(() => coercePathOrUrl(join(dir, "missing"))).toThrow("Invalid File path or URL");
    expect(getCoercePath({ kind: "file", name: "spec" })(spec)).toBe(spec);
    expect(getCoercePath({ kind: "directory", name: "output" })(dir)).toBe(dir);
    expect(() => getCoercePath({ kind: "directory", name: "output" })(spec)).toThrow("Invalid Directory");
    expect(() => getCoercePath({ kind: "file", name: "spec" })(join(dir, "missing"))).toThrow("Invalid File");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

it("should register generation commands when defining the CLI", () => {
  expect(createCommand.run).toBe(createCommandRun);
  expect(frameCommand.run).toBe(frameCommandRun);
  expect(templateEjectCommand.meta).toEqual(expect.objectContaining({ name: "template-eject" }));
});

it.each([createCommandRun, frameCommandRun])(
  "should reject and clean up when the specification is invalid",
  async (run) => {
    const dir = await mkdtemp(join(tmpdir(), "command-failure-"));
    try {
      const spec = join(dir, "invalid.json");
      await writeFile(spec, "{invalid json");
      await expect(
        run({
          args: { spec, output: join(dir, "out"), type: join(dir, "paths.d.ts"), "log-level": "error" },
        } as Parameters<typeof createCommandRun>[0] & Parameters<typeof frameCommandRun>[0]),
      ).rejects.toThrow();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);

it.each([createCommandRun, frameCommandRun])(
  "should propagate write failures when the output path is a file",
  async (run) => {
    const dir = await mkdtemp(join(tmpdir(), "command-write-failure-"));
    try {
      const spec = join(dir, "spec.json");
      const type = join(dir, "paths.d.ts");
      const output = join(dir, "blocked");
      await writeFile(type, "export interface paths {}");
      await writeFile(output, "existing file");
      await writeFile(spec, JSON.stringify({ openapi: "3.0.3", info: { title: "Test", version: "1" }, paths: {} }));
      await expect(
        run({ args: { spec, output, type, "log-level": "error" } } as Parameters<typeof createCommandRun>[0] &
          Parameters<typeof frameCommandRun>[0]),
      ).rejects.toThrow();
      expect(await readFile(output, "utf8")).toBe("existing file");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);
