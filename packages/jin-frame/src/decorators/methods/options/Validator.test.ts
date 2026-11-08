import { NoopValidator } from "../../../__tests__/NoopValidator";
import { describe, expect, it } from "vitest";
import { getRequestMeta } from "#decorators/methods/handlers/getRequestMeta";
import { Validator } from "#decorators/methods/options/Validator";

class IamClass {}

describe("Validator", () => {
  it("should set validators metadata correctly when Validator decorator applied to class", () => {
    const validator = new NoopValidator({ type: "exception" });
    const handle = Validator({ 200: validator });
    handle(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.validators).toEqual({ 200: validator });
  });
});
