import { getReasonPhrase } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinValidationError } from "#exceptions/JinValidationError";
import { JinFrame } from "#frames/JinFrame";
import type { JinPassResp } from "#interfaces/JinPassResp";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import { getDuration } from "#tools/getDuration";
import { BaseValidator } from "#validators/BaseValidator";

@Get({ host: "https://api.example.com", path: "/test" })
class TestFrame extends JinFrame {}

describe("JinValidationError", () => {
  it("gettter/setter", () => {
    const req: JinRequestConfig = { url: "https://api.example.com", method: "GET", headers: {} };
    const resp: JinPassResp<unknown> = {
      ok: true,
      data: undefined,
      status: 500,
      statusText: getReasonPhrase(500),
      headers: {},
      raw: new Response(),
      valid: false,
      $validated: { valid: false, error: [] },
    };
    const validator = new BaseValidator({ type: "exception" });
    const jf = new JinValidationError({
      debug: {
        ts: {
          unix: "1674349200",
          iso: "1674349200",
        },
        isDeduped: false,
        duration: getDuration(new Date(2023, 0, 1, 0, 0, 1), new Date(2023, 0, 1, 0, 0, 2)),
        req,
      },
      resp,
      frame: new TestFrame(),
      message: "error",
      validator,
      validated: { valid: false, error: [] },
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
    expect(jf.validated).toEqual({ valid: false, error: [] });
    expect(jf.validator).toBe(validator);
  });
});
