import { describe, expect, it } from "vitest";
import { Param } from "#decorators/fields/Param";

describe("Param", () => {
  it("should return query decorator handle when pass option", () => {
    const hanlde = Param({ replaceAt: "name" });
    expect(hanlde).toBeTruthy();
  });
});
