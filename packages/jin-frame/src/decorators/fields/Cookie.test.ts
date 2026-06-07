import { describe, expect, it } from "vitest";
import { Cookie } from "#decorators/fields/Cookie";

describe("Cookie", () => {
  it("should return cookie decorator handle when pass option", () => {
    const handle = Cookie({ replaceAt: "session_id" });
    expect(handle).toBeTruthy();
  });
});
