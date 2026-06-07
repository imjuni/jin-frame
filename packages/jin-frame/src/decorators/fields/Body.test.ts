import { describe, expect, it } from "vitest";
import { Body } from "#decorators/fields/Body";

describe("Body", () => {
  it("should return query decorator handle when pass option", () => {
    const hanlde = Body({ replaceAt: "name" });
    expect(hanlde).toBeTruthy();
  });
});
