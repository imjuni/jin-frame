import { describe, expect, it } from "vitest";
import { getUrlValue } from "#tools/getUrlValue";

describe("getUrlValue", () => {
  it("should return string value when passed string", () => {
    const result = getUrlValue("url");
    expect(result).toEqual("url");
  });

  it("should return function result when passed function", () => {
    const result = getUrlValue(() => "url");
    expect(result).toEqual("url");
  });

  it("should return string value when passed string", () => {
    const result = getUrlValue(undefined);
    expect(result).toBeUndefined();
  });

  it("should return function result when passed function", () => {
    const result = getUrlValue(() => undefined);
    expect(result).toBeUndefined();
  });
});
