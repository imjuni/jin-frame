import { describe, expect, it } from "vitest";
import { Query } from "#decorators/fields/Query";

describe("Query", () => {
  it("should return query decorator handle when pass option", () => {
    const hanlde = Query({ replaceAt: "name" });
    expect(hanlde).toBeTruthy();
  });
});
