import { describe, expect, it } from "vitest";
import { removeBothSlash } from "#tools/slash-utils/removeBothSlash";

describe("removeBothSlash", () => {
  it("truthy case", () => {
    const removed = removeBothSlash("/test/");
    const orgin = removeBothSlash("test");

    expect(removed).toEqual("test");
    expect(orgin).toEqual("test");
  });
});
