import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getResponseContentTypes } from "#generators/content-type/getResponseContentTypes.js";

describe("getResponseContentTypes", () => {
  it("should return empty response types when responses is undefined", () => {
    const result = getResponseContentTypes(undefined);
    expect(result).toEqual({});
  });

  it("should return 2xx content as success response type", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "201": {
        description: "Created",
        content: { "application/json": {} },
      },
    };

    const result = getResponseContentTypes(responses);
    expect(result).toEqual({
      success: { statusCode: "201", mediaType: "application/json" },
    });
  });

  it("should return non-2xx content as fail response type", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "400": {
        description: "fail and 400 status code",
        content: { "application/json": {} },
      },
      "500": {
        description: "fail and 500 status code",
        content: {},
      },
    };

    const result = getResponseContentTypes(responses);

    expect(result).toEqual({
      fail: { statusCode: "400", mediaType: "application/json" },
    });
  });

  it("should return success and fail response types separately", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "200": {
        description: "Success",
        content: { "application/json": {} },
      },
      "405": {
        description: "Invalid input",
        content: { "application/json": {} },
      },
    };

    const result = getResponseContentTypes(responses);

    expect(result).toEqual({
      success: { statusCode: "200", mediaType: "application/json" },
      fail: { statusCode: "405", mediaType: "application/json" },
    });
  });

  it("should treat a 2XX range response as success", () => {
    const responses = {
      "2XX": { description: "Success", content: { "application/json": {} } },
      default: { description: "Failure", content: { "application/json": {} } },
    } satisfies OpenAPIV3.ResponsesObject;

    expect(getResponseContentTypes(responses)).toEqual({
      success: { statusCode: "2XX", mediaType: "application/json" },
      fail: { statusCode: "default", mediaType: "application/json" },
    });
  });

  it("should prefer an explicit success response over a 2XX range", () => {
    const responses = {
      "2XX": { description: "Range", content: { "application/json": {} } },
      "201": { description: "Created", content: { "application/json": {} } },
    } satisfies OpenAPIV3.ResponsesObject;

    expect(getResponseContentTypes(responses).success).toEqual({
      statusCode: "201",
      mediaType: "application/json",
    });
  });
});
