import { afterEach, expect, it, vi } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinFrame } from "#frames/JinFrame";
import { BaseValidator } from "#validators/BaseValidator";
import type { ValidationInput, ValidatorMap } from "#validators/BaseValidator";

type Replies = { status: 200; data: { name: string } } | { status: 404; data: { message: string } };
class NameValidator extends BaseValidator<Extract<Replies, { status: 200 }>, string, string> {
  getData(reply: ValidationInput<Extract<Replies, { status: 200 }>>) {
    return reply.data.name;
  }
  validator(name: string) {
    return name ? { valid: true as const } : { valid: false as const, error: ["missing name"] };
  }
}
const validMap = { 200: new NameValidator({ type: "value" }) } satisfies ValidatorMap<Replies>;
const invalidMap: ValidatorMap<Replies> = {
  // @ts-expect-error A 200 validator cannot validate a 404 response.
  404: new NameValidator({ type: "value" }),
};
void invalidMap;
@Get({ host: "https://example.test", path: "/", validators: validMap })
class Frame extends JinFrame<Replies> {}
afterEach(() => vi.unstubAllGlobals());

it.each([204, 404, 500])("should skip validation when status %i has no validator", async (status) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(status === 204 ? null : "{}", { status })),
  );
  await expect(Frame.of({})._execute({ validateStatus: () => true })).resolves.toMatchObject({
    status,
    valid: true,
    $validated: { valid: true },
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
  @Get({ host: "https://example.test", validators: { [status]: new ThrowingValidator({ type: "exception" }) } })
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
      return reply.data;
    }
    async validator() {
      return { valid: false as const, error: ["invalid"] };
    }
  }
  @Get({ host: "https://example.test", validators: { 404: new InvalidValidator({ type: "exception" }) } })
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
      return reply.data;
    }
    async validator(): Promise<never> {
      throw new Error("schema failed");
    }
  }
  @Get({ host: "https://example.test", validators: { 500: new AsyncValidator({ type: "value" }) } })
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

it("should reject unlisted status keys in typed maps", () => {
  const map: ValidatorMap<Replies> = {
    // @ts-expect-error Status 500 is not declared in Replies.
    500: new NameValidator({ type: "value" }),
  };
  expect(map).toBeDefined();
});
