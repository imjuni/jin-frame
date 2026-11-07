import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import type { GeneratorEvent } from "#generators/interfaces/IGeneratorObserverOptions.js";
import { load } from "#openapi/load.js";
import { createOpenapiTs } from "#openapi/createOpenapiTs.js";

afterEach(() => vi.unstubAllGlobals());
const document = { openapi: "3.0.3", info: { title: "Test", version: "1" }, paths: {} };

it("should preserve loaded data when an observer is supplied", async () => {
  const directory = await mkdtemp(join(tmpdir(), "load-events-"));
  try {
    const path = join(directory, "spec.json");
    await writeFile(path, JSON.stringify(document));
    const events: GeneratorEvent[] = [];
    expect(await load(path, { onEvent: (event) => events.push(event) })).toEqual(await load(path));
    expect(events).toEqual([
      { type: "stage", stage: "load-spec", state: "started" },
      { type: "stage", stage: "load-spec", state: "completed" },
    ]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

it("should omit completion when fetching a specification fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, statusText: "Unavailable" }));
  const events: GeneratorEvent[] = [];
  await expect(load("https://example.com/spec.json", { onEvent: (event) => events.push(event) })).rejects.toThrow(
    "503",
  );
  expect(events).toEqual([{ type: "stage", stage: "load-spec", state: "started" }]);
});

it("should preserve generated types when an observer is supplied", async () => {
  const events: GeneratorEvent[] = [];
  const observed = await createOpenapiTs(document, { silent: true, onEvent: (event) => events.push(event) });
  expect(observed).toBe(await createOpenapiTs(document, { silent: true }));
  expect(events).toEqual([
    { type: "stage", stage: "generate-types", state: "started" },
    { type: "stage", stage: "generate-types", state: "completed" },
  ]);
});

it("should omit completion when type transformation fails", async () => {
  const events: GeneratorEvent[] = [];
  await expect(
    createOpenapiTs(
      { ...document, components: { schemas: { Value: { type: "string" } } } },
      {
        silent: true,
        onEvent: (event) => events.push(event),
        transform() {
          throw new Error("transform failed");
        },
      },
    ),
  ).rejects.toThrow("transform failed");
  expect(events).toEqual([{ type: "stage", stage: "generate-types", state: "started" }]);
});

it("should return undefined when local and remote specifications cannot be parsed", async () => {
  const directory = await mkdtemp(join(tmpdir(), "invalid-spec-"));
  try {
    const path = join(directory, "invalid.json");
    await writeFile(path, "[");
    expect(await load(path)).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[")));
    expect(await load("https://example.com/invalid.json")).toBeUndefined();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
