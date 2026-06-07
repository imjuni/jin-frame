import { describe, expect, it } from "vitest";
import { Header } from "#decorators/fields/Header";

describe("Header", () => {
  it("should return query decorator handle when pass option", () => {
    const hanlde = Header({ replaceAt: "name" });
    expect(hanlde).toBeTruthy();
  });
});
