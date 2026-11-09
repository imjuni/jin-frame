---
outline: deep
---

# Concurrent request deduplication

`@Dedupe()` shares an in-flight fetch among equivalent requests. This is not a persistent response cache: the entry disappears after completion or failure.

## Concurrent calls

```ts twoslash
import { Dedupe, Get, JinFrame, Param } from 'jin-frame';

@Dedupe()
@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly id: string;
}

// Concurrent equivalent requests can share one network operation.
const replies = await Promise.all([
  UserFrame.of({ id: '123' })._execute(),
  UserFrame.of({ id: '123' })._execute(),
]);

// Each caller receives an independently readable reconstructed response.
console.log(replies.map((reply) => reply.status));
```

## Eligibility and identity

Sharing is enabled only when no caller signal is supplied and the body is absent or a string. FormData, streams, and caller-controlled cancellation bypass it. The transport identity includes effective URL, method, body, headers, credentials, timeout, and relevant request settings; different authentication must not share results.

## Exclusions

Field options `cacheKeyExclude` and body `cacheKeyExcludePaths` affect decorated-field identity without removing values from the request. Only exclude values that cannot alter response identity. A timestamp may be suitable; an account identifier or access token is not.

## Responses and failures

The shared response is buffered and reconstructed for callers; no-body statuses retain their empty body. Every caller still applies its own response acceptance and validation. `DebugInfo.isDeduped` in `_postHook` indicates joining existing work, not a cache hit on a historical response.

Prefer idempotent reads. Deduplication does not make a write operation safe to repeat or replace server-side idempotency keys.
