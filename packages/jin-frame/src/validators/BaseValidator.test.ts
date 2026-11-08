import { NoopValidator } from "../__tests__/NoopValidator";
import { describe, expect, it } from "vitest";

describe("Validator", () => {
  it("should create validator instance with correct type when constructor called with exception type", () => {
    const validator = new NoopValidator({ type: "exception" });
    expect(validator).toBeDefined();
    expect(validator.type).toBe("exception");
  });

  it("should return original data when getData method called with input data", () => {
    const validator = new NoopValidator({ type: "exception" });
    const data = validator.getData({ data: "name" });
    expect(data).toBe("name");
  });

  it("should return valid result when validator method called with valid data", () => {
    const validator = new NoopValidator({ type: "exception" });
    const data = validator.validator("name");
    expect(data).toEqual({ valid: true });
  });

  it("should return valid result when validate method called with valid data", async () => {
    const validator = new NoopValidator({ type: "exception" });
    const data = await validator.validate({
      data: "name",
      status: 200,
      statusText: "OK",
      headers: {},
      raw: new Response(),
      ok: true,
    });
    expect(data).toEqual({ valid: true });
  });
});
