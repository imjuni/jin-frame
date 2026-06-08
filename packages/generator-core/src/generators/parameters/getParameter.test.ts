import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getParameter } from "#generators/parameters/getParameter.js";

describe("getParameter", () => {
  const parameter: OpenAPIV3.ParameterObject = {
    name: "status",
    in: "query",
    description: "Status values that need to be considered for filter",
    required: true,
    explode: true,
    schema: {
      type: "string",
      default: "available",
      enum: ["available", "pending", "sold"],
    },
  };

  it("should return query parameter", () => {
    const result = getParameter({ method: "method", pathKey: "pa/th/key", parameter });
    expect(result).toEqual({
      decorator: "Query",
      property: {
        decorators: [
          {
            name: "Query",
            arguments: ["{ comma: true }"],
          },
        ],
        docs: ["Status values that need to be considered for filter"],
        name: "status",
        type: "NonNullable<paths['pa/th/key']['method']['parameters']['query']>['status']",
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: false,
        scope: "public",
        kind: 31,
      },
    });
  });

  it("should return query parameter with explode false and required undefined", () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.explode = false;
    specificParameter.required = undefined;

    const result = getParameter({
      method: "method",
      pathKey: "pa/th/key",
      parameter: specificParameter,
    });

    expect(result).toEqual({
      decorator: "Query",
      property: {
        decorators: [
          {
            name: "Query",
            arguments: [],
          },
        ],
        docs: ["Status values that need to be considered for filter"],
        name: "status",
        type: "NonNullable<paths['pa/th/key']['method']['parameters']['query']>['status']",
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: true,
        scope: "public",
        kind: 31,
      },
    });
  });

  it("should use schema description when parameter description is omitted", () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.description = undefined;
    specificParameter.schema = {
      type: "string",
      description: "Status schema description",
    };

    const result = getParameter({
      method: "method",
      pathKey: "pa/th/key",
      parameter: specificParameter,
    });

    expect(result?.property.docs).toEqual(["Status schema description"]);
  });

  it("should include parameter and schema descriptions together", () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.schema = {
      type: "string",
      description: "Status schema description",
    };

    const result = getParameter({
      method: "method",
      pathKey: "pa/th/key",
      parameter: specificParameter,
    });

    expect(result?.property.docs).toEqual([
      `Status values that need to be considered for filter
Status schema description`,
    ]);
  });

  it("should return undefined when parameter in is unknown", () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.in = "unknown";

    const result = getParameter({
      method: "method",
      pathKey: "pa/th/key",
      parameter: specificParameter,
    });

    expect(result).toBeUndefined();
  });
});
