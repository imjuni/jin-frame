import { BearerTokenProvider } from "#providers/security/BearerTokenProvider";
import { afterEach, expect, it, vi } from "vitest";
import { Get } from "#decorators/methods/Get";
import { Dedupe } from "#decorators/methods/options/Dedupe";
import { JinFrame } from "#frames/JinFrame";
import { RequestDedupeManager } from "#frames/RequestDedupeManager";
import { sleep } from "#tools/sleep";

@Get({
  host: "https://lifecycle.test",
  path: "/users",
  security: new BearerTokenProvider(),
  retry: { max: 3, interval: 1000 },
})
@Dedupe()
class LifecycleFrame extends JinFrame<{ status: 200; data: { user: string } }> {}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  RequestDedupeManager.clearAllPendingRequests();
});

it.each([204, 205, 304])("should reconstruct both callers when status is %i", async (status) => {
  const requester = vi.fn(async () => new Response(null, { status }));
  const results = await Promise.all([
    RequestDedupeManager.dedupe("empty", requester),
    RequestDedupeManager.dedupe("empty", requester),
  ]);
  expect(requester).toHaveBeenCalledTimes(1);
  expect(results.map(({ resp }) => resp.status)).toEqual([status, status]);
});

it("should isolate runtime URLs and credentials when deduplicating requests", async () => {
  const fetcher = vi.fn(async (request: Request) => {
    await Promise.resolve();
    return Response.json({ user: `${request.url}:${request.headers.get("Authorization")}` });
  });
  vi.stubGlobal("fetch", fetcher);
  const results = await Promise.all([
    LifecycleFrame.of({})._execute({ host: "https://first.test", dynamicAuth: "first" }),
    LifecycleFrame.of({})._execute({ host: "https://second.test", dynamicAuth: "first" }),
    LifecycleFrame.of({})._execute({ host: "https://first.test", dynamicAuth: "second" }),
  ]);
  expect(fetcher).toHaveBeenCalledTimes(3);
  expect(new Set(results.map((result) => result.data.user)).size).toBe(3);
});

it("should wait only between attempts when every request fails", async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn(async () => new Response(null, { status: 500 }));
  vi.stubGlobal("fetch", fetcher);
  const started = Date.now();
  const result = LifecycleFrame.of({})
    ._execute()
    .catch((error: unknown) => error);
  await vi.runAllTimersAsync();
  await result;
  expect(fetcher).toHaveBeenCalledTimes(3);
  expect(Date.now() - started).toBe(2000);
});

it("should stop waiting and retrying when the caller aborts", async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const fetcher = vi.fn(async () => new Response(null, { status: 500 }));
  vi.stubGlobal("fetch", fetcher);
  const result = LifecycleFrame.of({})
    ._execute({ signal: controller.signal })
    .catch((error: unknown) => error);
  await vi.advanceTimersByTimeAsync(0);
  controller.abort();
  await result;
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});

it("should reject immediately when sleep receives an aborted signal", async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(sleep(1000, controller.signal)).rejects.toBe(controller.signal.reason);
});

it("should share identical requests when neither caller supplies a signal", async () => {
  const fetcher = vi.fn(async () => Response.json({ user: "same" }));
  vi.stubGlobal("fetch", fetcher);
  await Promise.all([LifecycleFrame.of({})._execute(), LifecycleFrame.of({})._execute()]);
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it("should measure each execution independently when a frame is reused", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ user: "same" })),
  );
  const frame = LifecycleFrame.of({});
  await vi.advanceTimersByTimeAsync(5000);
  const first = await frame._create()();
  expect(first.$debug.duration).toBe(0);
  await vi.advanceTimersByTimeAsync(5000);
  const second = await frame._create()();
  expect(second.$debug.duration).toBe(0);
  expect(frame._getData("retry").try).toBe(1);
});

it("should avoid sending requests when the caller signal is already aborted", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const controller = new AbortController();
  controller.abort();
  await expect(LifecycleFrame.of({})._execute({ signal: controller.signal })).rejects.toThrow();
  expect(fetcher).not.toHaveBeenCalled();
});

it("should skip the final wait when fetch rejects on every attempt", async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn(async () => {
    throw new Error("Network failure");
  });
  vi.stubGlobal("fetch", fetcher);
  const started = Date.now();
  const result = LifecycleFrame.of({})
    ._execute()
    .catch((error: unknown) => error);
  await vi.runAllTimersAsync();
  await result;
  expect(fetcher).toHaveBeenCalledTimes(3);
  expect(Date.now() - started).toBe(2000);
});

it("should separate HTTP methods when endpoint fields match", async () => {
  const fetcher = vi.fn(async () => Response.json({ user: "same" }));
  vi.stubGlobal("fetch", fetcher);
  const frame = LifecycleFrame.of({});
  await Promise.all([
    frame._retry({ url: "https://lifecycle.test/users", method: "GET", headers: {} }, (ok) => ok),
    frame._retry({ url: "https://lifecycle.test/users", method: "POST", headers: {} }, (ok) => ok),
  ]);
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it("should expose updated execution timestamps when a frame succeeds and is reused", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      await sleep(20);
      return Response.json({ user: "same" });
    }),
  );
  const frame = LifecycleFrame.of({});
  expect(frame._endAt).toBeUndefined();
  await vi.advanceTimersByTimeAsync(100);
  const started = Date.now();
  const result = frame._execute();
  await vi.advanceTimersByTimeAsync(0);
  expect(frame._startAt.getTime()).toBe(started);
  expect(frame._eachStartAt.getTime()).toBe(started);
  expect(frame._endAt).toBeUndefined();
  await vi.advanceTimersByTimeAsync(20);
  await result;
  expect(frame._endAt?.getTime()).toBe(started + 20);
  const snapshot = frame._startAt;
  snapshot.setTime(0);
  expect(frame._startAt.getTime()).toBe(started);
  const next = frame._execute();
  await vi.advanceTimersByTimeAsync(0);
  expect(frame._endAt).toBeUndefined();
  expect(frame._startAt.getTime()).toBe(started + 20);
  await vi.advanceTimersByTimeAsync(20);
  await next;
  expect(frame._endAt?.getTime()).toBe(started + 40);
});

it("should record attempt and completion timestamps when retries fail", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 500 })),
  );
  const frame = LifecycleFrame.of({});
  const started = Date.now();
  const result = frame._execute().catch((error: unknown) => error);
  await vi.runAllTimersAsync();
  await result;
  expect(frame._startAt.getTime()).toBe(started);
  expect(frame._eachStartAt.getTime()).toBe(started + 2000);
  expect(frame._endAt?.getTime()).toBe(started + 2000);
});

it("should record completion when execution is cancelled", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 500 })),
  );
  const frame = LifecycleFrame.of({});
  const controller = new AbortController();
  const result = frame._execute({ signal: controller.signal }).catch((error: unknown) => error);
  await vi.advanceTimersByTimeAsync(10);
  controller.abort();
  await result;
  expect(frame._endAt?.getTime()).toBe(Date.now());
});

it("should preserve the latest execution timestamps when an older request completes later", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockImplementationOnce(async () => {
      await sleep(100);
      return Response.json({ user: "older" });
    })
    .mockImplementationOnce(async () => {
      await sleep(10);
      return Response.json({ user: "latest" });
    });
  vi.stubGlobal("fetch", fetcher);
  const frame = LifecycleFrame.of({});
  const older = frame._execute({ signal: new AbortController().signal });
  await vi.advanceTimersByTimeAsync(20);
  const started = Date.now();
  const latest = frame._execute({ signal: new AbortController().signal });
  await vi.advanceTimersByTimeAsync(10);
  await latest;
  expect(frame._endAt?.getTime()).toBe(started + 10);
  await vi.advanceTimersByTimeAsync(70);
  await older;
  expect(frame._startAt.getTime()).toBe(started);
  expect(frame._endAt?.getTime()).toBe(started + 10);
});
