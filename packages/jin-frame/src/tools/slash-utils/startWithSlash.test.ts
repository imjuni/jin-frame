import { describe, expect, it } from "vitest";
import { startWithSlash } from "#tools/slash-utils/startWithSlash";

describe("startWithSlash", () => {
  it("truthy case", () => {
    const removed = startWithSlash("/test");
    const orgin = startWithSlash("test");

    expect(removed).toEqual("/test");
    expect(orgin).toEqual("/test");
  });
});
