---
outline: deep
---

# Hooks

`JinFrame` provides two lifecycle hooks that run **before** and **after** each HTTP request. Override them in a subclass to add logging, token injection, metrics, or any cross-cutting concern without modifying the frame's core request logic.

## \_preHook

Runs just before the HTTP request is dispatched. Receives the fully-built `JinRequestConfig` so you can inspect or mutate it (for example, to inject a fresh token).

```ts
import { Get, JinFrame } from 'jin-frame';
import type { JinRequestConfig } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;

  protected override async _preHook(req: JinRequestConfig): Promise<void> {
    const token = await getAccessToken(); // e.g. refresh if expired
    req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  }
}
```

### Signature

```ts
protected _preHook(req: JinRequestConfig): void | Promise<void>
```

| Parameter | Type               | Description                        |
| --------- | ------------------ | ---------------------------------- |
| `req`     | `JinRequestConfig` | The request config about to be sent |

> Mutating `req` inside `_preHook` **does** affect the outgoing request.

---

## \_postHook

Runs after the HTTP response is received (whether pass or fail). Receives the request config, the discriminated-union response, and debug timing info.

```ts
import { Get, JinFrame } from 'jin-frame';
import type { JinRequestConfig, JinResp, DebugInfo } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<User>,
    debug: DebugInfo,
  ): void {
    console.log(`[${reply.ok ? 'OK' : 'FAIL'}] ${req.url} — ${debug.duration}ms`);
  }
}
```

### Signature

```ts
protected _postHook(
  req: JinRequestConfig,
  reply: JinResp<Pass, Fail>,
  debugInfo: DebugInfo,
): void | Promise<void>
```

| Parameter   | Type                    | Description                            |
| ----------- | ----------------------- | -------------------------------------- |
| `req`       | `JinRequestConfig`      | The request config that was sent       |
| `reply`     | `JinResp<Pass, Fail>`   | Discriminated-union response (`ok: true \| false`) |
| `debugInfo` | `DebugInfo`             | Timing and deduplication metadata      |

### DebugInfo

```ts
interface DebugInfo {
  ts: { unix: string; iso: string }; // Request start timestamp
  duration: number;                  // Total request duration in ms
  isDeduped: boolean;                // Whether this response was deduplicated
  req: JinRequestConfig;             // Request config snapshot
}
```

---

## Shared Base Frame Pattern

The hooks pattern is especially useful when combined with inheritance. Define hooks once in a base frame and all subclasses inherit the behaviour automatically.

```ts
import { JinFrame } from 'jin-frame';
import type { JinRequestConfig, JinResp, DebugInfo } from 'jin-frame';

abstract class ApiBase<Pass, Fail = Pass> extends JinFrame<Pass, Fail> {
  protected override async _preHook(req: JinRequestConfig): Promise<void> {
    const token = await tokenStore.get();
    req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  }

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<Pass, Fail>,
    debug: DebugInfo,
  ): void {
    metrics.record({ url: req.url, status: reply.status, duration: debug.duration });
  }
}

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends ApiBase<User> {
  @Param()
  declare public readonly id: string;
}

@Post({ host: 'https://api.example.com', path: '/users' })
class CreateUserFrame extends ApiBase<User> {
  @Body()
  declare public readonly name: string;
}
```

---

## Common Use Cases

| Use Case                  | Hook         | Example                                           |
| ------------------------- | ------------ | ------------------------------------------------- |
| Token injection / refresh | `_preHook`   | Attach `Authorization` header before each request |
| Request logging           | `_preHook`   | Log the outgoing URL and method                   |
| Response logging          | `_postHook`  | Log status code and latency                       |
| Metrics / tracing         | `_postHook`  | Record duration in a metrics collector            |
| Error alerting            | `_postHook`  | Send alert when `reply.ok === false`              |
| Cache invalidation        | `_postHook`  | Bust a cache after a successful mutation          |
