import { describe, expect, it } from "vitest";
import { isValidateStatusDefault } from "#tools/isValidateStatusDefault";

describe("isValidateStatusDefault", () => {
  it("should successfully", () => {
    const result = isValidateStatusDefault(true, 200);
    expect(result).toBeTruthy();
  });

  it("should fail", () => {
    const result = isValidateStatusDefault(false, 400);
    expect(result).toBeFalsy();
  });
});
