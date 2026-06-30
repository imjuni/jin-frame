import { getReasonPhrase } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinCreateError } from "#exceptions/JinCreateError";
import { JinFrame } from "#frames/JinFrame";
import { getDuration } from "#tools/getDuration";

@Get({ host: "https://api.example.com", path: "/test" })
class TestFrame extends JinFrame {}

describe("JinCreateError", () => {
  it("gettter/setter", () => {
    const jf = new JinCreateError({
      debug: {
        ts: {
          unix: "1674349200",
          iso: "1674349200",
        },
        duration: getDuration(new Date(2023, 0, 1, 0, 0, 1), new Date(2023, 0, 1, 0, 0, 2)),
        isDeduped: false,
      },
      frame: new TestFrame(),
      message: "error",
    });

    expect(jf.debug).toMatchObject({
      ts: {
        unix: "1674349200",
        iso: "1674349200",
      },
      duration: 1000,
    });

    expect(jf.frame).toMatchObject({});
    expect(jf.status).toEqual(500);
    expect(jf.statusText).toEqual(getReasonPhrase(500));
    expect(jf.message).toEqual("error");
  });
});
