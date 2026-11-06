import { Get } from "#decorators/methods/Get";
import { expectTypeOf, it, afterEach, expect, vi } from "vitest";
import { JinFrame } from "#frames/JinFrame";

type Responses = { status: 200; data: { name: string } } | { status: 400; data: { message: string } };
class StatusFrame extends JinFrame<Responses> {}

it("should narrow response data by status regardless of validateStatus", () => {
  type Result = Awaited<ReturnType<StatusFrame["_execute"]>>;
  type CreatedResult = Awaited<ReturnType<ReturnType<StatusFrame["_create"]>>>;
  expectTypeOf<CreatedResult>().toExtend<Result>();
  expectTypeOf<Extract<Result, { status: 200 }>["data"]>().toEqualTypeOf<{ name: string }>();
  expectTypeOf<Extract<Result, { status: 400 }>["data"]>().toEqualTypeOf<{ message: string }>();
  const check = (result: Result) => {
    if (result.status === 200) {
      expectTypeOf(result.data).toEqualTypeOf<{ name: string }>();
    } else {
      expectTypeOf(result.data).toEqualTypeOf<{ message: string }>();
    }
  };
  expectTypeOf(check).toBeFunction();
});

@Get({ host: "https://example.test", path: "/status" })
class RuntimeStatusFrame extends StatusFrame {}

afterEach(() => vi.unstubAllGlobals());

it.each([200, 201, 302, 400, 500])("should apply default acceptance for status %i", async (status) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ message: "response" }), { status })),
  );
  const request = RuntimeStatusFrame.of({})._execute();
  await (status < 300
    ? expect(request).resolves.toMatchObject({ status, data: { message: "response" } })
    : expect(request).rejects.toMatchObject({ resp: { status } }));
});

it.each([302, 400, 500])("should return status %i when validateStatus accepts every response", async (status) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ message: "response" }), { status })),
  );
  await expect(RuntimeStatusFrame.of({})._execute({ validateStatus: () => true })).resolves.toMatchObject({
    status,
    data: { message: "response" },
  });
});

it("should reject a success status when validateStatus returns false", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}", { status: 200 })),
  );
  await expect(RuntimeStatusFrame.of({})._execute({ validateStatus: () => false })).rejects.toMatchObject({
    resp: { status: 200 },
  });
});

it("should preserve network errors when validateStatus accepts every response", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("network unavailable");
    }),
  );
  await expect(RuntimeStatusFrame.of({})._execute({ validateStatus: () => true })).rejects.toThrow(
    "network unavailable",
  );
});

it("should wrap a non-Error hook failure with the fallback message", async () => {
  class HookFailureFrame extends RuntimeStatusFrame {
    protected override _preHook(): never {
      throw "hook failure";
    }
  }
  await expect(HookFailureFrame.of({})._execute()).rejects.toThrow("unknown error raised");
});
