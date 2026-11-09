---
outline: deep
---

# Response status unions and errors

A frame declares one union of `{ status, data }` variants. Check `status` to narrow the corresponding body. The default call accepts 2xx and returns declared successful variants; acceptance does not validate the body.

## Select accepted statuses

```ts twoslash
import { Get, JinFrame, JinRespError, validateStatus } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
})
class UserFrame extends JinFrame<Replies> {}

try {
  // The typed predicate includes both declared response variants.
  const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });

  if (reply.status === 404) {
    // Hover over data to see the error-body type.
    console.log(reply.data.message);
  } else {
    console.log(reply.data.name);
  }
} catch (error) {
  // Let unrelated errors propagate instead of treating them as HTTP failures.
  if (!(error instanceof JinRespError)) {
    throw error;
  }

  // Only an attached response represents an actual HTTP response.
  const response = error.resp;

  if (response === undefined) {
    // Network or pre-response processing failures may have no response.
    console.error(error.message, error.cause);
  } else {
    console.error(response.status, response.data, response.headers);
  }
}
```

## Policy and inference

Pass `validateStatus` to `_execute()` or `_create()`, not a method decorator. `validateStatus(200, 404)` preserves the status/body relationship. `() => true` returns all declared variants; an ordinary boolean callback does not narrow them. Broad `status: number` remains broad.

`ok` is runtime acceptance, not a discriminant for the body. Use `status` for narrowing. An error status deliberately accepted by the policy still uses that status's schema during validation.

## Response presence

`JinRespError.resp` can be undefined. A network failure does not create an artificial HTTP 500 response. Error-level status/statusText without a response are diagnostic values, not evidence of a server reply. `cause` preserves the underlying failure.

When an HTTP response exists, errors retain its status, headers, raw response, and available body/validation information. A throwing deserializer, validator, or hook may fail processing even though a server responded; do not classify every error as a network outage.

`validateStatus: () => true` accepts HTTP statuses but cannot prevent transport, cancellation, or processing failures. In `exception` validation mode, invalid accepted responses throw `JinValidationError`.

## Cancellation is independent of status acceptance

`validateStatus: () => true` prevents rejection based on HTTP status only; it does not guarantee that `_execute()` resolves. When the caller's `AbortSignal` is aborted, `throwIfAborted()` stops sending or retrying the request. Cancellation is wrapped in `JinRespError`, with the abort reason in `cause` and no attached HTTP response when none was received. Removing the explicit check would not prevent fetch itself from rejecting on cancellation.

## Raw response and timing

Use `cloneRaw: true` when the raw response body must remain readable after parsing. It increases memory use. Frame timestamps `_startAt`, `_eachStartAt`, and `_endAt` describe the most recently started execution, not an immutable log of every concurrent call.
