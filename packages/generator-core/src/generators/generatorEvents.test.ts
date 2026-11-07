import { describe, expect, it } from "vitest";
import type { OpenAPIV3 } from "openapi-types";
import { createFrames } from "#generators/createFrames.js";
import type { GeneratorEvent } from "#generators/interfaces/IGeneratorObserverOptions.js";

const document: OpenAPIV3.Document = {
  openapi: "3.0.3",
  servers: [{ url: "https://example.com" }],
  info: { title: "test", version: "1" },
  paths: { "/pets": { get: { operationId: "listPets", responses: { "200": { description: "OK" } } } } },
  components: { securitySchemes: { oauth: { type: "oauth2", flows: {} } } },
};
const options = { document, output: "generated", specTypeFilePath: "paths.d.ts", useCodeFence: false };

describe("generator events", () => {
  it("should preserve results when an observer is supplied", async () => {
    const events: GeneratorEvent[] = [];
    const observed = await createFrames({ ...options, onEvent: (event) => events.push(event) });
    const silent = await createFrames(options);
    expect(observed.map(({ frame }) => frame.source)).toEqual(silent.map(({ frame }) => frame.source));
    expect(events.filter((event) => event.type === "stage")).toEqual([
      { type: "stage", stage: "resolve-references", state: "started" },
      { type: "stage", stage: "resolve-references", state: "completed" },
      { type: "stage", stage: "load-templates", state: "started" },
      { type: "stage", stage: "load-templates", state: "completed" },
      { type: "stage", stage: "generate-frames", state: "started" },
      { type: "stage", stage: "generate-frames", state: "completed" },
    ]);
    expect(events).toContainEqual({ type: "progress", stage: "generate-frames", completed: 1, total: 1 });
    expect(events).toContainEqual(expect.objectContaining({ type: "diagnostic", code: "UNSUPPORTED_SECURITY_SCHEME" }));
  });

  it("should propagate observer errors when a callback throws", async () => {
    await expect(
      createFrames({
        ...options,
        onEvent: () => {
          throw new Error("observer failed");
        },
      }),
    ).rejects.toThrow("observer failed");
  });
});

it("should isolate observers when generations run concurrently", async () => {
  const left: GeneratorEvent[] = [];
  const right: GeneratorEvent[] = [];
  await Promise.all([
    createFrames({ ...options, onEvent: (event) => left.push(event) }),
    createFrames({ ...options, onEvent: (event) => right.push(event) }),
  ]);
  expect(left).toEqual(right);
  expect(left.filter((event) => event.type === "progress")).toHaveLength(1);
});

it("should report increasing endpoint counts when generating multiple frames", async () => {
  const events: GeneratorEvent[] = [];
  await createFrames({
    ...options,
    baseFrame: "BaseFrame",
    document: {
      ...document,
      paths: {
        ...document.paths,
        "/users": { get: { operationId: "listUsers", responses: { "200": { description: "OK" } } } },
      },
    },
    onEvent: (event) => events.push(event),
  });
  expect(events.filter((event) => event.type === "progress")).toEqual([
    { type: "progress", stage: "generate-frames", completed: 1, total: 2 },
    { type: "progress", stage: "generate-frames", completed: 2, total: 2 },
  ]);
});

it("should complete without progress when the document has no endpoints", async () => {
  const events: GeneratorEvent[] = [];
  await createFrames({ ...options, document: { ...document, paths: {} }, onEvent: (event) => events.push(event) });
  expect(events.filter((event) => event.type === "progress")).toEqual([]);
  expect(events.at(-1)).toEqual({ type: "stage", stage: "generate-frames", state: "completed" });
});

it("should omit completion when reference resolution fails", async () => {
  const events: GeneratorEvent[] = [];
  await expect(
    createFrames({
      ...options,
      document: { ...document, components: { schemas: { Broken: { $ref: "#/components/schemas/Missing" } } } },
      onEvent: (event) => events.push(event),
    }),
  ).rejects.toThrow();
  expect(events).toEqual([{ type: "stage", stage: "resolve-references", state: "started" }]);
});
