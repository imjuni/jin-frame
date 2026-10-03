import { describe, expect, it } from "vitest";
import { getRequestMeta } from "#decorators/methods/handlers/getRequestMeta";
import { Trace } from "#decorators/methods/Trace";

class TestFrame {}

describe("Trace", () => {
  it("should configure a TRACE request", () => {
    Trace()(TestFrame);

    expect(getRequestMeta(TestFrame).option.method).toBe("TRACE");
  });
});
