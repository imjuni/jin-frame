# Compatibility and Migration Notes

Interface changes impose a real cost on applications: updating frame declarations, generated code, hooks, error handling, and tests. This document describes that work explicitly. A successful build is only one migration check; runtime acceptance policies, authentication isolation, cancellation, and response parsing also need verification.

This is the consumer migration companion to [CHANGED.md](./CHANGED.md), which retains the historical release log. Examples below are labeled by version. Do not combine an older example's generic arguments or method names with the current API.

## Release status and scope

- **6.0: unreleased development changes.** These notes describe the implementation through commit `9054405`. The package manifest still declares `jin-frame` version `5.1.0`; this document does not announce a published 6.0 package.
- Historical reference points are repository tags `v3.14.0`, `v4.0.0`, `v4.8.0`, and `v5.1.0`. Minor releases within a major can differ; use the tag matching your installed version when checking signatures.
- Generator CLI and core have independent `1.0.0` package versions. Their generated frames must target the matching jin-frame runtime API; a generator version alone does not establish runtime compatibility.
- Consumer-facing behavior is distinguished from build-tool changes. Removing `tsc-alias` from this repository does not require applications to remove their own alias tooling.

## Choose your migration path

| Installed API | Main work before adopting 6.0 |
| --- | --- |
| 3.x | Replace static field decorators and constructor-based endpoint setup; migrate Axios behavior, method names, authentication, and response types. |
| 4.x | Migrate Axios/Either usage, method and type names, URI templates, validators, authentication, and response generics. |
| 5.x | Replace `Pass, Fail` generics with status/data unions; move decorator status policies to call options; migrate response/error consumers and dedupe expectations. |
| An earlier 6.0 development snapshot | Remove generated `_defaultValidateStatus` fields and helper imports used only by those fields. Default 2xx inference is now shared by the base class. |

Work through the relevant sections in order. For a large application, first update its shared base frames and HTTP adapter, then regenerate endpoint frames, then update callers. Keep each runtime/generator pair pinned while migrating.

## 6.0 migration from 5.x

### 1. Declare responses as a status/data union

**Breaking:** `JinFrame<Pass, Fail>` becomes `JinFrame<Response>`. The argument represents response envelopes, not a body DTO. `status` must be numeric and `data` must be present on every member, including responses with no body.

Before, in 5.x:

```typescript
class GetUserFrame extends JinFrame<User, NotFound> {}
```

After, in 6.0:

```typescript
import { Get, JinFrame } from 'jin-frame';

type User = { id: string; name: string };
type NotFound = { code: 'USER_NOT_FOUND'; message: string };
type UserResponse =
  | { status: 200; data: User }
  | { status: 404; data: NotFound };

@Get({ host: 'https://api.example.com', path: '/users/current' })
class GetUserFrame extends JinFrame<UserResponse> {}
```

For an empty response, write `{ status: 204; data: undefined }`. Preserve separate union members when different statuses have different bodies. Avoid `{ status: 200 | 404; data: User | NotFound }`: it loses the relationship between a code and its body.

`status: number` remains supported for broad/manual declarations, but cannot provide exact status narrowing. The default success filter preserves broad numeric declarations rather than assuming a specific documented success code. Prefer literal status codes whenever known. Type declarations do not validate server payloads; use validators when runtime body validation is required.

### 2. Default calls infer successful responses

An omitted or undefined call-level `validateStatus` uses the native HTTP success policy (2xx). The return type contains only the declared successful variants.

```typescript
const response = await GetUserFrame.of({})._execute();
response.data.name; // User; a documented 404 is thrown instead of returned.
```

The same rule applies to the function returned by `_create()`. If the API documents different successful bodies, such as 200 and 202, the default return type remains their union; narrow by `status`. No successful response is arbitrarily selected as the primary response.

If a literal response union has no 2xx member, the inferred default result is `never`. Supply an explicit policy when intentionally returning a documented non-2xx response. An undocumented server response can still occur at runtime; the generated/static types are not a runtime schema check.

### 3. Move status policies out of decorators

**Breaking:** `FrameOption.validateStatus` is removed. `@Get`, `@Post`, and other frame configuration decorators no longer accept it. A decorator cannot convey its predicate to the class's method return type, so allowing it to redefine acceptance would make default success inference unsound.

Before, in 5.x:

```typescript
@Get({
  host: 'https://api.example.com',
  path: '/users/current',
  validateStatus: (_ok, status) => status === 200 || status === 404,
})
class GetUserFrame extends JinFrame<User, NotFound> {}
```

After, keep endpoint configuration in the decorator and put acceptance at the call site:

```typescript
import { validateStatus } from 'jin-frame';

const response = await GetUserFrame.of({})._execute({
  validateStatus: validateStatus(200, 404),
});

if (response.status === 404) {
  response.data.code; // NotFound
} else {
  response.data.name; // User
}
```

For repeated calls, reuse an options object or create a requester with `_create({ validateStatus: validateStatus(200, 404) })`. A wrapper can centralize application policy while preserving inferred return types.

| Call policy | Runtime acceptance | Inferred return type |
| --- | --- | --- |
| Omitted / `undefined` | Native 2xx success | Declared successful variants |
| `validateStatus(200)` | Exactly 200 | Declared 200 variant |
| `validateStatus(200, 404)` | Exactly 200 or 404 | Declared 200/404 variants |
| A correctly declared status type guard | Predicate result | Variants selected by the predicate |
| An ordinary boolean callback | Callback result | Full declared response union |
| `() => true` | Every received HTTP status | Full declared response union |

A boolean callback such as `(ok) => ok` is conservative at the type level: it does not carry a status predicate. Omit it to get default success inference. TypeScript trusts manually written type guards; prefer the helper to keep the accepted list and the predicate aligned.

The helper does not introduce undocumented body types. Selecting an undocumented code does not create a new response variant.

### 4. Narrow by `status`, not `ok`

**Breaking:** the response is no longer `JinPassResp<Pass> | JinFailResp<Fail>`. `JinPassResp` and `JinFailResp` are removed; use `JinResp<ResponseUnion>`. `ok` is a boolean describing whether the configured policy accepted the response, not a type discriminator or an unconditional synonym for HTTP 2xx.

```typescript
const response = await GetUserFrame.of({})._execute({
  validateStatus: () => true,
});

if (response.status === 200) {
  response.data.name;
} else if (response.status === 404) {
  response.data.code;
}
```

An accepted 404 has `ok: true`. Checking `response.ok` does not narrow its body. Update hooks, validators, and utilities that previously depended on `ok: true | false` discrimination.

| Previous declaration | 6.0 replacement |
| --- | --- |
| `JinFrame<Pass, Fail>` | `JinFrame<ResponseUnion>` |
| `JinResp<Pass, Fail>` | `JinResp<ResponseUnion>` |
| `JinPassResp<Pass>` / `JinFailResp<Fail>` | `JinResp<ResponseUnion>` or a status-selected subset |
| `JinRespError<Pass, Fail>` | `JinRespError<ResponseUnion>` |
| Hook accepting separate pass/fail types | Hook accepting `JinResp<ResponseUnion>` |

The former combined `Hooks` declaration is also replaced by individual hook types (`PreHook`, `PostHook`, and `RetryFailHook`); update direct imports of the removed type.

Review explicit `GetError`, `JinFrameFunction`, `PostHook`, `JinValidationError`, and custom validator type annotations too. Follow their current exported declarations rather than mechanically removing a generic argument: some parameters represent validation errors or frame types, not response bodies.

### 5. Handle errors without inventing an HTTP response

`JinRespError.resp` can be undefined. Network failures, cancellation, and errors before a usable HTTP response exists cannot supply a real response body. Inspect `cause` and the presence of `resp` separately.

```typescript
import { JinRespError } from 'jin-frame';

try {
  await GetUserFrame.of({})._execute();
} catch (error) {
  if (error instanceof JinRespError) {
    if (error.resp == null) {
      console.error(error.cause);
    } else {
      console.error(error.resp.status, error.resp.data);
    }
  } else {
    throw error;
  }
}
```

The error's numeric `status` may be a fallback value when no response exists. Do not infer that a server returned HTTP 500 from that field alone. `validateStatus: () => true` accepts HTTP responses; it does not turn network errors, hook failures, or cancellation into successful results. Custom `getError` handlers can return other error classes, so retain application-specific handling.

### 6. Review dedupe exclusions and cancellation

Execution dedupe keys now include the actual URL, method, normalized headers, string body, and timeout, alongside the field-based key. Different runtime hosts, paths, authentication values, or bodies must not share a response.

**Behavior change:** `cacheKeyExclude` and `cacheKeyExcludePaths` still affect `_getCacheKey()`, but do not override execution safeguards. Two requests whose actual URLs or bodies differ may now produce separate network calls even if the differing field was excluded. Review applications relying on excluded timestamps, request IDs, query parameters, or body properties to coalesce requests.

Requests with a caller-provided `AbortSignal` bypass dedupe, including callers sharing the same signal. Non-string bodies also bypass dedupe. This favors cancellation isolation and safe body handling over coalescing. Identical eligible requests still share one pending request, and bodyless 204/205/304 responses are reconstructed consistently for original and joining callers.

### 7. Retry and timing behavior

- `retry.max` is the maximum number of attempts, not additional retries. With `max: 3`, there are at most three attempts and two intervening waits.
- There is no wait after the final failed HTTP response or exception.
- Caller cancellation stops retrying and interrupts an active retry wait. Per-attempt timeout handling remains distinct from explicit caller cancellation.
- Retry counters reset for each execution. Custom retry interval callbacks receive elapsed times based on the current execution and attempt, not instance construction.
- Response debug duration is measured per execution, including its hooks and retry work up to the point where debug information is constructed; it no longer includes time spent holding an unused instance.
- Public `_startAt`, `_eachStartAt`, and `_endAt` getters expose Date copies for the most recently started execution. Before execution, start values reflect construction time and `_endAt` is undefined. `_endAt` is cleared on start and recorded in the execution's finalization on success, failure, or cancellation. `_create()` records execution when its requester is invoked, not when it is prepared.
- Older overlapping executions cannot overwrite the latest execution's timestamp snapshot. Use each call's debug information for its individual duration. The frame snapshot is not a history of all calls.

Update fake-timer tests and latency expectations that counted a terminal retry delay. Do not add that delay back to preserve an obsolete expectation.

### 8. Runtime, packaging, and generators

The workspace currently declares Node.js `^22.23.4` and uses TypeScript `6.0.3`. CI exercises Node 22, 24, and 26, but that does not broaden the published `engines` range. Resolve engine-policy requirements before adopting a different Node major. TypeScript 7 preparation is not a claim that the current compiler has been replaced by TypeScript 7.

`jin-frame` retains ESM and CommonJS runtime entry points. Generator core is ESM-only; the CLI is an executable-only ESM package and does not expose an importable library API. Use generator core for programmatic integration.

The declaration build removes `tsc-alias`, uses package subpath imports instead of remaining source `paths` aliases, and bundles declarations with Rollup. Consumers should import public package exports instead of repository source paths or private `#...` imports. This change does not mean `tsc` itself bundles declarations.

Regenerate endpoint frames and their `paths.d.ts` together into a clean temporary output directory before replacing committed generated files. Review generated response aliases and custom base frames/templates. The earlier development `_defaultValidateStatus` field is no longer generated or required. If a custom template still emits it, update the template.

The current generator models explicit numeric response codes; `2XX` and `default` response entries are not generated. Do not treat the generated union as exhaustive for specs relying on those entries. Core/CLI also add configurable hosts, endpoint overrides, security generation, progress reporting, and Eta templates; see their [core](./packages/generator-core/README.md) and [CLI](./packages/generator-cli/README.md) documentation for exact APIs.

## 5.x migration from 4.x

These changes precede the 6.0 response-union migration. Skip this section only if your application already uses the 5.x API.

### Transport and endpoint declarations

- Axios is replaced by native fetch. `JinRequestConfig` is no longer `AxiosRequestConfig`; remove Axios-only options, interceptors, response assumptions, and transport mocks from the jin-frame integration. Adapt them explicitly to hooks, request options, or application code.
- URI templates use `{id}` rather than `:id`. Update decorator paths, runtime URL templates, generated fixtures, and tests together.
- Native `Response` metadata is available through `raw`. The body may already be consumed. Use call-level `cloneRaw: true` if you need to read it again; cloning has a memory cost.
- `deserialize(text)` handles custom parsing. Invalid JSON falls back to its original text in 5.0.2 and later; do not assume every `data` value is an object.

### Names and construction

| 4.x usage | 5.x usage, retained in 6.0 unless noted above |
| --- | --- |
| `execute()` / `create()` / `requestWrap()` | `_execute()` / `_create()` / `_requestWrap()` |
| `getData()` / `getCacheKey()` / `setFields()` | `_getData()` / `_getCacheKey()` / `_setFields()` |
| `IJinFrameRequestConfig` | `JinFrameRequestConfig` |
| `IDebugInfo` | `DebugInfo` |
| `IFrameOption` | `FrameOption` |
| `TMethod` | `Method` |

I/T prefixes were removed broadly. Consult the actual export when migrating each name; not every historical helper has a one-to-one replacement. Review custom subclasses and overrides in addition to direct calls.

`of()` accepts a field object or builder callback. Builders track required public fields and finish with `.build()`. Constructor arguments can be forwarded by `of()` and `builder()`. Fields excluded from the builder include methods and underscore-prefixed members; execution timestamp getters do not become request fields.

### Authentication and validation

- `@Authorization` is removed. Supply the key through `@Security(provider, key)` or supported method options.
- `OAuth2Provider` is removed. Use `BearerTokenProvider` for sending OAuth2 Bearer access tokens; this does not implement the OAuth token acquisition/refresh flow for you.
- `SecurityKey` can be lazy or asynchronous. `_execute()` resolves function-based keys before request creation; a requester prepared with `_create()` does not independently provide the same key-resolution step on each invocation. Prefer `_execute()` when the configured key must be resolved per call.
- `validator` becomes `validators: { pass, fail }`. `valid` and `$validated` are always populated. Fail validators annotate the failure response and do not throw `JinValidationError`; pass validators can throw when configured with `type: 'exception'`.
- `validateStatus(status)` becomes `validateStatus(ok, status)`. A previously single-argument status callback would receive a boolean if copied unchanged. In 6.0, this callback is supported in call options only.

### Either and response handling

`JinEitherFrame` and `my-only-either` integration are removed in 5.0. Use `JinFrame`. The **5.x** replacement has body generics `JinFrame<Pass, Fail>` and `JinResp<Pass, Fail>` with `ok` discrimination. The **6.0** replacement instead uses the status/data union described above. Do not stop at a 5.x Either migration example when targeting 6.0.

Keep rejected HTTP responses and successful responses distinct from transport errors. Test authentication failures and cancellation with native fetch/MSW rather than Axios error mocks.

### 5.x minor releases worth checking

| Version | Consumer impact |
| --- | --- |
| 5.0.2 | Non-JSON response parsing retains the raw string. |
| 5.0.3 | Added decorator-level status policies; these must move to call options in 6.0. |
| 5.0.4 | Inherited decorated fields are discovered through the prototype chain. Check subclasses with shadowed fields. |
| 5.1.0 | Added runtime `host`, `pathPrefix`, and `path` overrides. Review tenant/auth isolation when using dedupe. |

Historical runtime support statements in [CHANGED.md](./CHANGED.md) apply to their release context, not automatically to the current development branch.

## 4.x migration from 3.x

At the `v3.14.0` reference point, field decorators were static members such as `JinFrame.query()` / `JinFrame.Q()` and endpoint configuration could be passed through constructor arguments such as `$$host`, `$$path`, and `$$method`.

In 4.0, use exported field decorator functions (`Query`, `Param`, `Body`, `ObjectBody`, `Header`) and method/class metadata for endpoint configuration. Review subclass constructors and `super(...)` calls; do not carry obsolete constructor configuration into a no-argument frame factory. Static factories such as `of()` were introduced for typed construction.

For example, the field declaration changes from a static decorator to an exported function:

```typescript
// 3.x field declaration
@JinFrame.query()
public readonly search?: string;
```

```typescript
// Current field declaration
@Query()
declare public readonly search?: string;
```

The `declare` form is appropriate for metadata-decorated fields populated through the frame factory; also check your project's class-field emit settings. Preserve legacy decorator compiler options and `reflect-metadata` integration rather than switching to standard decorators as part of this migration.

Both the 3.x and 4.x reference implementations still used Axios and offered `JinEitherFrame`. Those concerns are separate from the field-decorator migration and are removed later in 5.x. Hook spellings also changed between major APIs (the 4.0/4.8 reference implementations used `$_preHook`, while the current API uses `_preHook`); inspect overridden hook names in the source for your installed tag rather than assuming all 4.x examples are identical.

For historical details beyond these verified reference points, use [the existing 4.x release notes](./CHANGED.md#400) and the matching repository tag. This document does not invent unverified minor-release migration guarantees for 3.x.

## Application migration checklist

1. Record the exact installed runtime and generator versions. Pin them and save representative generated output before upgrading.
2. Search application code and custom templates for `JinEitherFrame`, Axios options/types, `:param` paths, old method names, I/T-prefixed imports, and overridden hooks.
3. Convert shared frame and response types. Give each documented status its own envelope; include `data: undefined` for bodyless statuses.
4. Move every decorator `validateStatus` to a call or reusable requester. Prefer the typed helper when selecting known statuses; use a boolean callback deliberately when returning the full union.
5. Replace `ok`-based body narrowing with `status` checks. Audit hooks, validators, and custom error handlers, not just endpoint callers.
6. Guard optional `error.resp` and inspect `cause`. Do not reinterpret cancellation as an HTTP server response.
7. Regenerate into a separate directory, review diffs, then replace generated files. Update custom base classes and Eta templates before regenerating application output.
8. Run the application's actual type check. Verify one 200-only endpoint needs no narrowing and one 200/404 policy narrows to the correct bodies.
9. Test different users/hosts concurrently with dedupe enabled, excluded request fields, already-aborted signals, cancellation during retry waits, and bodyless responses.
10. Verify retry attempt counts, removal of the terminal delay, and execution timestamps when a frame is reused or requests overlap.
11. Deploy through the application's normal staged rollout. Retain the previous pinned dependency set and generated artifacts for rollback; restoring only the runtime can leave incompatible generated types behind.

AI-assisted edits can reduce repetitive work, but casts such as `as any`, non-null assertions on `error.resp`, or broad `status: number` declarations can hide a migration defect. Review behavior changes and keep the regression checks above even when compilation succeeds.
