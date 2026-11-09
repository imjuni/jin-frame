---
outline: deep
---

# Migrating to v6

Use runtime `jin-frame` 6.x with generator packages 1.x. Regenerate clients after updating the generator. Node.js must satisfy the declared `^22.23.4` engine; generators use TypeScript >= 6 and openapi-typescript >= 7.

## Migration checklist

| Previous usage | Current usage |
| --- | --- |
| `JinFrame<Pass, Fail>` | One `{ status, data }` union. |
| `JinPassResp` / `JinFailResp` | `JinResp<Response>` with status discrimination. |
| Decorator `validateStatus` | Call-level `_execute()` or `_create()` option. |
| Validators grouped by pass/fail | One validator selecting schemas by status. |
| Assuming `error.resp` always exists | Guard undefined; inspect `cause`. |
| Provider name as first constructor argument | Key or synchronous key supplier first. |
| Static `typeof this` for defaults | Explicit `Partial<PublicFieldsOf<ChildFrame>>` override. |

## Response types

```ts twoslash
import { Get, JinFrame, validateStatus } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
})
class UserFrame extends JinFrame<Replies> {}

// A typed predicate accepts the error response without losing its body type.
const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });
if (reply.status === 404) {
  console.log(reply.data.message);
}
```

## Authentication constructors

`new BearerTokenProvider('token')` now means a token, not a name. Preserve custom names with `new BearerTokenProvider(undefined, 'schemeName')`. API keys use `new ApiKeyProvider(key, keyName, location, name?)`. Async lookups stay on decorator authorization or `@Security(provider, asyncSupplier)`.

Generated security subclasses accept an optional constructor key and preserve OpenAPI scheme names as metadata. Update custom templates as well as generated output; otherwise a scheme name could be sent as a credential.

## Factories and defaults

`of()` and `of(undefined)` are allowed only when no required public fields exist. Required fields still need an object or callback. Default-backed required fields remain required in the object signature; defaults cannot be inferred from a protected static method.

## Validation and errors

Migrate validators to receive the complete status/data response. Keep getData() response-preserving. Schema selection belongs inside the validator, not in a pass/fail registration map. Guard `resp` before reading status or data from errors.

## Earlier major versions

Axios/Either removal and RFC 6570 URL templates belong to earlier migrations. Current application examples use fetch and `_execute()`. Consult [release history](https://github.com/imjuni/jin-frame/blob/master/CHANGED.md) for historical APIs rather than copying those patterns into new code.

## Generated responses

Only explicit numeric response codes become status variants. `2XX` ranges and `default` are not emitted. Multiple content types for one status become a body union; the runtime does not add a media-type discriminant. See [generator configuration](./generator-core/configuration).
