import { describe, expect, it } from "vitest";
import { removeEndSlash } from "#tools/slash-utils/removeEndSlash";

describe("removeEndSlash", () => {
  it("truthy case", () => {
    const removed = removeEndSlash("test/");
    const orgin = removeEndSlash("test");

    expect(removed).toEqual("test");
    expect(orgin).toEqual("test");
  });
});
