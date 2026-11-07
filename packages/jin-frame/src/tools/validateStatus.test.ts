import { expect, expectTypeOf, it } from "vitest";
import { JinFrame } from "#frames/JinFrame";
import { validateStatus } from "#tools/validateStatus";

type Responses = { status: 200; data: { name: string } } | { status: 404; data: { message: string } };
class UserFrame extends JinFrame<Responses> {
  public override readonly _defaultValidateStatus = validateStatus(200);
}

it("should accept only configured statuses when validating a response", () => {
  const predicate = validateStatus(200, 404);
  expect(predicate(true, 200)).toBe(true);
  expect(predicate(false, 404)).toBe(true);
  expect(predicate(true, 201)).toBe(false);
});

it("should infer default and overridden statuses when creating requests", () => {
  // Type-only calls avoid creating requests without decorator metadata.
  const check = async (frame: UserFrame) => {
    const normal = await frame._execute();
    expectTypeOf(normal.status).toEqualTypeOf<200>();
    expectTypeOf(normal.data.name).toEqualTypeOf<string>();
    const selected = await frame._execute({ validateStatus: validateStatus(404) });
    expectTypeOf(selected.status).toEqualTypeOf<404>();
    const all = await frame._execute({ validateStatus: () => true });
    expectTypeOf(all.status).toEqualTypeOf<200 | 404>();
    const created = await frame._create()();
    expectTypeOf(created.status).toEqualTypeOf<200>();
  };
  expect(check).toBeTypeOf("function");
});

it("should apply the default predicate and allow call overrides when receiving HTTP errors", async () => {
  const { Get } = await import("#decorators/methods/Get");
  const { http, HttpResponse } = await import("msw");
  const { setupServer } = await import("msw/node");
  @Get({ host: "https://status.test", path: "/user", validateStatus: () => true })
  class DefaultFrame extends UserFrame {}
  const server = setupServer(
    http.get("https://status.test/user", () => HttpResponse.json({ message: "Missing" }, { status: 404 })),
  );
  server.listen({ onUnhandledRequest: "error" });
  try {
    const frame = DefaultFrame.of({});
    await expect(frame._execute()).rejects.toMatchObject({ resp: { status: 404 } });
    const response = await frame._execute({ validateStatus: validateStatus(404) });
    expect(response.status).toBe(404);
    expect(response.data.message).toBe("Missing");
  } finally {
    server.close();
  }
});
