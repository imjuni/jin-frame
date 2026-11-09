---
outline: deep
---

# Lifecycle hooks

Hooks observe or adjust request execution. Keep business response handling in the caller and shared transport behavior in a base frame.

## Request and response hooks

```ts twoslash
import { Get, JinFrame } from 'jin-frame';
import type { DebugInfo, JinRequestConfig, JinResp } from 'jin-frame';

type Replies = { status: 200; data: { name: string } };

@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class ProfileFrame extends JinFrame<Replies> {
  protected override _preHook(request: JinRequestConfig): void {
    // Mutating the built request changes the outgoing HTTP request.
    request.headers = { ...request.headers, 'X-Client': 'web' };
  }

  protected override _postHook(request: JinRequestConfig, reply: JinResp<Replies>, debug: DebugInfo): void {
    // Log metadata only; avoid leaking headers or response secrets.
    console.log(request.method, reply.status, debug.duration);
  }
}
```

## Hook boundaries

| Hook | Input | Timing |
| --- | --- | --- |
| `_preHook` | JinRequestConfig | Once before the transport/retry sequence. |
| `_postHook` | Request, response, debug info | After an HTTP response is processed, including rejected statuses. |
| `_retryFail` | Request, native Response clone | Rejected HTTP attempts, including the final attempt. |
| `_retryException` | Request, Error | Transport exceptions, including the final attempt. |

Hooks can return `void` or `Promise<void>`. `_postHook` cannot receive an HTTP response when none exists. Catch `_execute()` for the final outcome; retry hooks are observations, not recovery return values.

## Exceptions and ordering

A throwing pre-hook prevents the request. A throwing post-hook or validator can reject execution after the server has responded. The final wrapped error retains available response information and cause. Do not infer that an absent successful return means the server did not perform a write.

## Shared hooks

Override hooks on a common frame and call `super` when both parent and child behavior is needed. Mutating an instance for per-request state can race during concurrent executions; prefer local values or separate frame instances.
