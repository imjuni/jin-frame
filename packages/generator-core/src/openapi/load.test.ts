import fs from "node:fs";
import { exists } from "my-node-fp";
import { afterEach, describe, expect, it, vi } from "vitest";
import { load } from "#openapi/load.js";

vi.mock("my-node-fp", () => ({
  exists: vi.fn(),
}));

describe("load", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return openapi spec document object when pass yml spec file", async () => {
    const expectation = { name: "ironman" };
    const handle = vi.spyOn(fs.promises, "readFile").mockResolvedValue(Buffer.from(JSON.stringify(expectation)));

    vi.mocked(exists).mockResolvedValue(true);

    const result = await load("./samples/v3.yml");
    handle.mockRestore();

    expect(result).toEqual({ from: "file", kind: "json", data: expectation });
  });

  it("should return openapi spec document object when pass openapi spec url", async () => {
    const expectation = { name: "ironman" };
    const handle = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(expectation), {
        status: 200,
      }),
    );

    const result = await load("http://some.api.google.com/test");
    handle.mockRestore();

    expect(result).toEqual({ from: "url", kind: "json", data: expectation });
  });

  it("should throw error when openapi spec url returns non ok response", async () => {
    const handle = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Not Found", {
        status: 404,
        statusText: "Not Found",
      }),
    );

    await expect(load("http://some.api.google.com/missing")).rejects.toThrow(
      'Failed to load spec from "http://some.api.google.com/missing": 404 Not Found',
    );
    handle.mockRestore();
  });

  it("should return undefined when pass invalid file path", async () => {
    vi.mocked(exists).mockResolvedValue(false);

    const result = await load("/a/b/c/some-spec.yml");

    expect(result).toBeUndefined();
  });
});
