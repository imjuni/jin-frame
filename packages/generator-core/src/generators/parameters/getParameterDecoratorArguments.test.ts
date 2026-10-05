import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getParameterDecoratorArguments } from "#generators/parameters/getParameterDecoratorArguments.js";

function parameter(value: Partial<OpenAPIV3.ParameterObject>): OpenAPIV3.ParameterObject {
  return { in: "query", name: "value", ...value } as OpenAPIV3.ParameterObject;
}

describe("getParameterDecoratorArguments", () => {
  it.each([
    [parameter({ style: "spaceDelimited" }), ['{ separator: " " }']],
    [parameter({ style: "pipeDelimited" }), ['{ separator: "|" }']],
    [parameter({ style: "form", explode: false }), ["{ comma: true }"]],
    [parameter({ style: "form", explode: true }), []],
    [parameter({ in: "path", style: "simple" }), []],
  ])("should create supported serialization arguments", (value, expected) => {
    expect(getParameterDecoratorArguments(value)).toEqual(expected);
  });

  it.each([parameter({ style: "deepObject" }), parameter({ in: "path", style: "matrix" })])(
    "should reject unsupported serialization",
    (value) => {
      expect(() => getParameterDecoratorArguments(value)).toThrow("Unsupported OpenAPI parameter serialization");
    },
  );
});
