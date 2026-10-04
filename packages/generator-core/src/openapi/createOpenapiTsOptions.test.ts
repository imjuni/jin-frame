import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import { createOpenapiTsOptions } from "#openapi/createOpenapiTsOptions.js";

describe("createOpenapiTsOptions", () => {
  it("should preserve a custom transform when int64 conversion is disabled", () => {
    const transform = vi.fn();

    expect(createOpenapiTsOptions({ int64AsString: false, transform }).transform).toBe(transform);
  });

  it("should convert int64 schemas to string nodes", () => {
    const transform = createOpenapiTsOptions({ int64AsString: true }).transform;

    expect(transform?.({ type: "integer", format: "int64" }, {} as never)).toMatchObject({
      kind: ts.SyntaxKind.StringKeyword,
    });
  });

  it("should prefer a custom transform result", () => {
    const customNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    const transform = createOpenapiTsOptions({ int64AsString: true, transform: () => customNode }).transform;

    expect(transform?.({ type: "integer", format: "int64" }, {} as never)).toBe(customNode);
  });
});
