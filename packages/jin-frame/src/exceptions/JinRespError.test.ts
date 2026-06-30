import { getReasonPhrase } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinRespError } from "#exceptions/JinRespError";
import { JinFrame } from "#frames/JinFrame";
import type { JinFailResp } from "#interfaces/JinFailResp";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import { getDuration } from "#tools/getDuration";

@Get({ host: "https://api.example.com", path: "/test" })
class TestFrame extends JinFrame {}

describe("JinRequestError", () => {
  it("gettter/setter", () => {
    const req: JinRequestConfig = { url: "https://api.example.com", method: "GET", headers: {} };
    const resp: JinFailResp<unknown> = {
      ok: false,
      data: undefined,
      status: 500,
      statusText: getReasonPhrase(500),
      headers: {},
      raw: new Response(),
      valid: true,
      $validated: { valid: true },
    };
    const jf = new JinRespError({
      debug: {
        ts: {
          unix: "1674349200",
          iso: "1674349200",
        },
        duration: getDuration(new Date(2023, 0, 1, 0, 0, 1), new Date(2023, 0, 1, 0, 0, 2)),
        isDeduped: false,
        req,
      },
      resp,
      frame: new TestFrame(),
      message: "error",
    });

    expect(jf.debug).toMatchObject({
      ts: {
        unix: "1674349200",
        iso: "1674349200",
      },
      duration: 1000,
      req: {},
    });

    expect(jf.frame).toMatchObject({});
    expect(jf.resp).toMatchObject({});
    expect(jf.status).toEqual(500);
    expect(jf.statusText).toEqual(getReasonPhrase(500));
    expect(jf.message).toEqual("error");
  });
});
