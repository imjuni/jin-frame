import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";
import { getFrameResponseTypes } from "#generators/content-type/getFrameResponseTypes.js";

describe("getFrameResponseTypes", () => {
  it("should include all numeric statuses and preserve their data types", () => {
    const responses: OpenAPIV3.ResponsesObject = {
      "200": { description: "Success", content: { "application/json": {} } },
      "201": { description: "Created", content: { "application/json": {} } },
      "302": { description: "Redirect" },
      "400": { description: "Invalid", content: { "application/json": {}, "text/plain": {} } },
      "500": { description: "Error" },
      default: { description: "Default" },
      "2XX": { description: "Range" },
    };
    expect(getFrameResponseTypes({ pathKey: "/pet", method: "get", responses })).toEqual([
      `{ status: 200; data: paths['/pet']['get']['responses'][200]['content']["application/json"] }`,
      `{ status: 201; data: paths['/pet']['get']['responses'][201]['content']["application/json"] }`,
      "{ status: 302; data: undefined }",
      `{ status: 400; data: paths['/pet']['get']['responses'][400]['content']["application/json"] | paths['/pet']['get']['responses'][400]['content']["text/plain"] }`,
      "{ status: 500; data: undefined }",
    ]);
  });
  it("should return no members when responses are absent", () => {
    expect(getFrameResponseTypes({ pathKey: "/pet", method: "get" })).toEqual([]);
  });
});
