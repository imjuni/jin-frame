import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getResponseContentType } from "#/generators/content-type/getResponseContentType";

describe("getResponseContentType", () => {
  const responses: OpenAPIV3.ResponsesObject = {
    "200": {
      description: "Success",
      content: { "application/json": {} },
    },
  };

  it("should return undefined when responses is undefined", () => {
    const result = getResponseContentType(undefined);
    expect(result).toBeUndefined();
  });

  it("should return application/json when responses is 200", () => {
    const result = getResponseContentType(responses);
    expect(result).toEqual({ statusCode: "200", mediaType: "application/json" });
  });

  it("should return application/json when responses is 400", () => {
    const specificResponses = structuredClone(responses);
    delete specificResponses["200"];
    specificResponses["400"] = {
      description: "fail and 400 status code",
      content: { "application/json": {} },
    };
    specificResponses["500"] = {
      description: "fail and 500 status code",
      content: {},
    };
    const result = getResponseContentType(specificResponses);

    expect(result).toEqual({ statusCode: "400", mediaType: "application/json" });
  });
});
