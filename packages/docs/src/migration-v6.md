---
outline: deep
---

# Migrating to 6.0

Use `jin-frame` 6.0.0 with generator-cli and generator-core 1.0.0. The runtime still uses native `fetch`. Node.js must satisfy `^22.23.4`; this range does not include Node.js 24 or 26. The generators require TypeScript >= 6 and openapi-typescript >= 7; the runtime library supports TypeScript >= 5.0.

## Why 6.0 requires a breaking migration

The goal is to make handwritten frames, generated OpenAPI clients, inferred return types, and runtime validation describe the same HTTP contract. The previous pass/fail model could not preserve that contract without changes to public types and configuration.

### HTTP acceptance is not a response schema

In 5.x, `JinFrame<Pass, Fail>` grouped bodies into accepted and rejected responses. An API can return different bodies for 200, 201, 204, 404, and 500, and applications may intentionally accept a 404. Changing acceptance must not change which body belongs to a status. A numeric status/data union preserves that relationship; checking status narrows the matching body, while ok remains a runtime acceptance flag. Keeping the old generic arguments or ok discrimination would retain the ambiguity that the new model is intended to remove.

### Return types must follow the policy at the call site

Default calls return declared 2xx variants. The typed validateStatus helper can select 200 and 404 together, while ordinary boolean callbacks conservatively retain the full union. A class decorator cannot convey its predicate into a method's inferred return type. Therefore decorator-level validateStatus is removed and acceptance policies move to _execute() or _create() call options. Retaining both policies would allow runtime acceptance and the advertised return type to disagree.

### Validation must see the same complete response

Choosing validators by pass/fail would send a deliberately accepted 404 through a validator written for a success body. Registering a map of status-specific validator instances also duplicates the application's schema-selection policy. A single BaseValidator receives the complete response through getData() and validator(); application code chooses a schema from status and validates data while retaining headers and other metadata. The default getData() returns the response unchanged. Changing the registration shape and generic parameters prevents body-only extraction from silently losing the status/data relationship.

### Missing responses must remain distinguishable from server errors

A network or cancellation failure may have no HTTP response. A synthetic 500 response would incorrectly suggest that a server returned that status and body. Errors without a response expose resp as undefined and retain cause. When a response exists but extraction or validation throws, the real response is preserved instead. Consumers must guard optional resp and inspect validation and transport failures separately.

### Runtime and generated clients must migrate together

OpenAPI describes responses by status and media type. Generator 1.0.0 emits numeric status/data unions for runtime 6.0; old generated frames, custom templates, hooks, and validator signatures cannot all remain compatible with the new generic contract. Regenerate types and frames together and review application code using them. Media-type discrimination remains unfinished: the generator currently unions media-type bodies within each numeric status, and excludes range keys and default entries.

These changes alter public type arguments, narrowing, registration, and error handling, so a major version makes the migration explicit. This does not mean every change originated in 6.0: native fetch, removal of Axios/Either integration, and URI-template migration belong to 5.x. Repository tooling and the unified documentation workspace improve maintenance but are not by themselves reasons for a consumer-facing major version. Earlier release history and multi-version migration notes are consolidated in [CHANGED.md](https://github.com/imjuni/jin-frame/blob/master/CHANGED.md).

## Response types

Replace `JinFrame<Pass, Fail>` with `JinFrame<{ status: number; data: DTO }>` or a union of documented responses. Replace `JinPassResp` and `JinFailResp` with `JinResp<Response>`.

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

Without a call-level `validateStatus`, the returned type selects documented 2xx responses. `validateStatus(200, 404)` uses a type predicate to select those statuses. A boolean callback such as `() => true` keeps the complete response union. Decorator-level validateStatus is removed. Move acceptance policies to _execute() or _create() call options so runtime acceptance and return-type inference agree.

`ok` remains a boolean indicating acceptance by `validateStatus`; use `status` to narrow `data`. Register a single `validator: new ApiValidator()` receiving the complete response union, and select schemas by status inside the validator.

## Errors

Rejected HTTP statuses throw `JinRespError` with the actual HTTP response in `resp`. Network failures and other failures without a response may have `resp === undefined`; inspect `cause`. Diagnostic defaults such as `status: 500` do not imply an HTTP 500 response. Even `validateStatus: () => true` cannot turn a network failure into a response.

## Instance methods

Use `_execute()` for requests. Instance methods use the `_` prefix; static constructors remain `of()` and `builder()`. See [Naming Convention](./method/naming-convention).

## Regenerate clients

Upgrade the [generator packages](./generator) to 1.0.0 and regenerate clients. Generated frames use a single response union covering documented numeric 2xx–5xx statuses. Bodyless responses use `data: undefined`. `default` and range keys such as `2XX` are excluded from the numeric literal union.


## Validator migration

Replace pass/fail settings and status-keyed validator maps with a single validator. `BaseValidator<Replies, TError>` receives the complete response union and has no separate TData parameter. getData() returns the whole response by default and usually needs no override. Inside validator(response), inspect status and validate response.data using the appropriate schema.

```ts
// Before
validators: { pass: userValidator, fail: errorValidator }

// After
validator: new ApiValidator({ type: 'exception' })
```

[Whole-response validation example](./method/validation)
