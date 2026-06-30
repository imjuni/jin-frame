import { describe, expect, it } from "vitest";
import { flatStringMap } from "#processors/flatStringMap";

describe("flatStringMap", () => {
  it("should return flatten map when array value", () => {
    const map = flatStringMap({ name: ["ironman", "hulk"] });

    expect(map).toEqual({ name: "ironman,hulk" });
  });

  it("should return flatten map when array value and undefined ignored", () => {
    const map = flatStringMap({
      name: ["ironman", "hulk"],
      age: undefined,
    });

    expect(map).toEqual({ name: "ironman,hulk" });
  });

  it("should return flatten map when singular value", () => {
    const map = flatStringMap({ name: "ironman" });

    expect(map).toEqual({ name: "ironman" });
  });
});
