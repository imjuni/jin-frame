import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getFrameResponseTypes } from "#generators/content-type/getFrameResponseTypes.js";

describe("getFrameResponseTypes", () => {
  it("should return void success when responses has no 2xx content", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "405": {
        description: "Invalid input",
        content: { "application/json": {} },
      },
    };

    const result = getFrameResponseTypes({
      pathKey: "/pet",
      method: "post",
      responses,
    });

    expect(result).toEqual(["void", "paths['/pet']['post']['responses']['405']['content']['application/json']"]);
  });

  it("should return success type when responses has 2xx content", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "201": {
        description: "Created",
        content: { "application/json": {} },
      },
    };

    const result = getFrameResponseTypes({
      pathKey: "/pet",
      method: "post",
      responses,
    });

    expect(result).toEqual(["paths['/pet']['post']['responses']['201']['content']['application/json']"]);
  });
});
