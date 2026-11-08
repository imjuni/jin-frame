---
outline: deep
---

# Migrating to 6.0

Use `jin-frame` 6.0.0 with generator-cli and generator-core 1.0.0. The runtime still uses native `fetch`. Node.js must satisfy `^22.23.4`; this range does not include Node.js 24 or 26. The generators require TypeScript >= 6 and openapi-typescript >= 7; the runtime library supports TypeScript >= 5.0.

## Response types

Replace `JinFrame<DTO>` with `JinFrame<{ status: number; data: DTO }>` or a union of documented responses. Replace `JinPassResp` and `JinFailResp` with `JinResp<Response>`.

```ts
import { Get, JinFrame, validateStatus } from 'jin-frame';

type UserResponse =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({ host: 'https://api.example.com', path: '/user' })
class UserFrame extends JinFrame<UserResponse> {}

const frame = UserFrame.of({});
const success = await frame._execute();
console.log(success.data.name);

const reply = await frame._execute({ validateStatus: validateStatus(200, 404) });
if (reply.status === 200) {
  console.log(reply.data.name);
} else {
  console.error(reply.data.message);
}
```

Without a call-level `validateStatus`, the returned type selects documented 2xx responses. `validateStatus(200, 404)` uses a type predicate to select those statuses. A boolean callback such as `() => true` keeps the complete response union. A decorator-level callback controls runtime acceptance but does not infer the call's return type; pass a matching call-level validator when accepting non-2xx responses.

`ok` remains a boolean indicating acceptance by `validateStatus`; use `status` to narrow `data`. Register status-specific validators with `validators: { 200: validator }`. Missing status validators produce a valid result.

## Errors

Rejected HTTP statuses throw `JinRespError` with the actual HTTP response in `resp`. Network failures and other failures without a response may have `resp === undefined`; inspect `cause`. Diagnostic defaults such as `status: 500` do not imply an HTTP 500 response. Even `validateStatus: () => true` cannot turn a network failure into a response.

## Instance methods

Use `_execute()` for requests. Instance methods use the `_` prefix; static constructors remain `of()` and `builder()`. See [Naming Convention](./method/naming-convention).

## Regenerate clients

Upgrade the [generator packages](./generator) to 1.0.0 and regenerate clients. Generated frames use a single response union covering documented numeric 2xx–5xx statuses. Bodyless responses use `data: undefined`. `default` and range keys such as `2XX` are excluded from the numeric literal union.

## Validator migration

Replace `validators.pass/fail` with `validators: { 200: validator, 404: errorValidator }`. The first BaseValidator type argument is the `{ status, data }` response rather than `JinResp<Response>`. Implement both getData() and validator(), and use `ValidatorMap<Response>` to check status-specific inputs. See the [validation guide](./method/validation).

### Registration migration example

```ts
// Before 6.0
validators: { pass: userValidator, fail: errorValidator }

// Since 6.0
validators: {
  200: userValidator,
  404: errorValidator,
  500: errorValidator,
}
```

List every status formerly handled by pass/fail validators. Unlisted statuses pass validation, so include every status that requires a schema check. BaseValidator is abstract: implement both getData() and validator() instead of relying on a default no-op implementation.
