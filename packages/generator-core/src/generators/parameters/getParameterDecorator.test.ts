import { describe, expect, it } from "vitest";
import { getParameterDecorator } from "#generators/parameters/getParameterDecorator.js";

describe("getParameterDecorator", () => {
  it("should return Query when pass in: 'query'", () => {
    const result = getParameterDecorator("query");
    expect(result).toEqual({ decorator: "Query", in: "query" });
  });

  it("should return Param when pass in: 'path'", () => {
    const result = getParameterDecorator("path");
    expect(result).toEqual({ decorator: "Param", in: "path" });
  });

  it("should return Header when pass in: 'header'", () => {
    const result = getParameterDecorator("header");
    expect(result).toEqual({ decorator: "Header", in: "header" });
  });

  it("should return Cookie when pass in: 'cookie'", () => {
    const result = getParameterDecorator("cookie");
    expect(result).toEqual({ decorator: "Cookie", in: "cookie" });
  });

  it("should return undefined when pass in: 'body'", () => {
    const result = getParameterDecorator("body");
    expect(result).toBeUndefined();
  });
});
