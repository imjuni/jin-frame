import { describe, expect, it } from "vitest";
import { removeStartSlash } from "#tools/slash-utils/removeStartSlash";

describe("removeStartSlash", () => {
  it("truthy case", () => {
    const removed = removeStartSlash("/test");
    const orgin = removeStartSlash("test");

    expect(removed).toEqual("test");
    expect(orgin).toEqual("test");
  });
});
