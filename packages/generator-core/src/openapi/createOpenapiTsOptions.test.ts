import { NUMBER, STRING } from "openapi-typescript";
import { describe, expect, it, vi } from "vitest";
import { createOpenapiTsOptions } from "#openapi/createOpenapiTsOptions.js";

describe("createOpenapiTsOptions", () => {
  it("should preserve a custom transform when int64 conversion is disabled", () => {
    const transform = vi.fn();

    expect(createOpenapiTsOptions({ int64AsString: false, transform }).transform).toBe(transform);
  });

  it("should return a string type when the schema uses int64", () => {
    const transform = createOpenapiTsOptions({ int64AsString: true }).transform;

    expect(transform?.({ type: "integer", format: "int64" }, {} as never)).toBe(STRING);
  });

  it("should prefer a custom transform when it returns a result", () => {
    const customNode = NUMBER;
    const transform = createOpenapiTsOptions({ int64AsString: true, transform: () => customNode }).transform;

    expect(transform?.({ type: "integer", format: "int64" }, {} as never)).toBe(customNode);
  });
});
