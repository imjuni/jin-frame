import { afterEach, expect, it, vi } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinFrame } from "#frames/JinFrame";
import { BaseValidator } from "#validators/BaseValidator";
import type { ValidationInput, ResponseValidator } from "#validators/BaseValidator";

type Replies = { status: 200; data: { name: string } } | { status: 404; data: { message: string } };
class NameValidator extends BaseValidator<Replies, string> {
  validator(response: ValidationInput<Replies>) {
    if (response.status === 200) {
      return response.data.name ? { valid: true as const } : { valid: false as const, error: ["missing name"] };
    }
    return response.data.message ? { valid: true as const } : { valid: false as const, error: ["missing message"] };
  }
}
const validator = new NameValidator({ type: "value" }) satisfies ResponseValidator<Replies>;
@Get({ host: "https://example.test", path: "/", validator })
class Frame extends JinFrame<Replies> {}
afterEach(() => vi.unstubAllGlobals());

it.each([204, 404, 500])(
  "should return valid results when no validator is registered for status %i",
  async (status) => {
    @Get({ host: "https://example.test" })
    class UnvalidatedFrame extends JinFrame {}
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(status === 204 ? null : "{}", { status })),
    );
    await expect(UnvalidatedFrame.of({})._execute({ validateStatus: () => true })).resolves.toMatchObject({
      status,
      valid: true,
    });
  },
);
it("should let the validator select the error schema by status", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ message: "not found" }, { status: 404 })),
  );
  await expect(Frame.of({})._execute({ validateStatus: () => true })).resolves.toMatchObject({
    status: 404,
    valid: true,
  });
});
it("should attach failure when a status validator uses value mode", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ name: "" })),
  );
  await expect(Frame.of({})._execute()).resolves.toMatchObject({
    valid: false,
    $validated: { valid: false, error: ["missing name"] },
  });
});
it.each([200, 404])("should preserve HTTP context when extraction throws for status %i", async (status) => {
  class ThrowingValidator extends BaseValidator {
    getData(): never {
      throw new Error("extract failed");
    }
    validator() {
      return { valid: true as const };
    }
  }
  @Get({ host: "https://example.test", validator: new ThrowingValidator({ type: "exception" }) })
  class ThrowingFrame extends JinFrame {}
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ body: true }, { status, headers: { "x-test": "preserved" } })),
  );
  await expect(ThrowingFrame.of({})._execute()).rejects.toMatchObject({
    status,
    resp: { status, data: { body: true }, headers: { "x-test": "preserved" } },
    cause: { message: "extract failed" },
  });
});
it.each([false, true])("should select the same validator regardless of HTTP acceptance %s", async (accept) => {
  class InvalidValidator extends BaseValidator {
    getData(reply: ValidationInput) {
      return reply;
    }
    async validator() {
      return { valid: false as const, error: ["invalid"] };
    }
  }
  @Get({ host: "https://example.test", validator: new InvalidValidator({ type: "exception" }) })
  class InvalidFrame extends JinFrame {}
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({}, { status: 404 })),
  );
  const error = await InvalidFrame.of({})
    ._execute({ validateStatus: () => accept })
    .catch((e) => e);
  expect(error.constructor.name).toBe(accept ? "JinValidationError" : "JinRespError");
  expect(error.resp.$validated).toEqual({ valid: false, error: ["invalid"] });
});

it("should preserve HTTP response when an asynchronous validator throws", async () => {
  class AsyncValidator extends BaseValidator {
    getData(reply: ValidationInput) {
      return reply;
    }
    async validator(): Promise<never> {
      throw new Error("schema failed");
    }
  }
  @Get({ host: "https://example.test", validator: new AsyncValidator({ type: "value" }) })
  class AsyncFrame extends JinFrame {}
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ message: "server error" }, { status: 500 })),
  );
  await expect(AsyncFrame.of({})._execute()).rejects.toMatchObject({
    status: 500,
    resp: { status: 500, data: { message: "server error" } },
    cause: { message: "schema failed" },
  });
});

it("should preserve status and body correlation in the validator contract", () => {
  const unrelated: ResponseValidator<{ status: 200; data: { age: number } }> = {
    type: "value",
    // @ts-expect-error A validator for Replies cannot validate an unrelated payload.
    validate: validator.validate.bind(validator),
  };
  expect(unrelated).toBeDefined();
});

it.each([200, 204, 404, 500])(
  "should select a schema inside the whole-response validator for status %i",
  async (status) => {
    const successSchema = vi.fn((_data: unknown) => ({ valid: true as const }));
    const errorSchema = vi.fn((_data: unknown) => ({ valid: true as const }));
    class SchemaValidator extends BaseValidator {
      validator(response: ValidationInput) {
        const schema =
          response.status === 200
            ? successSchema
            : response.status === 404 || response.status === 500
              ? errorSchema
              : undefined;
        return schema?.(response.data) ?? { valid: true as const };
      }
    }
    const registered = new SchemaValidator({ type: "value" });
    const extraction = vi.spyOn(registered, "getData");
    @Get({ host: "https://example.test", validator: registered })
    class SchemaFrame extends JinFrame {}
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(status === 204 ? null : JSON.stringify({ message: "body" }), {
            status,
            headers: { "x-test": "present" },
          }),
      ),
    );
    await expect(SchemaFrame.of({})._execute({ validateStatus: () => true })).resolves.toMatchObject({
      status,
      valid: true,
    });
    expect(extraction).toHaveBeenCalledWith(
      expect.objectContaining({
        status,
        headers: expect.objectContaining({ "x-test": "present" }),
        raw: expect.any(Response),
      }),
    );
    expect(successSchema).toHaveBeenCalledTimes(status === 200 ? 1 : 0);
    expect(errorSchema).toHaveBeenCalledTimes(status === 404 || status === 500 ? 1 : 0);
  },
);
