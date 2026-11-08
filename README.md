# jin-frame

[Unified documentation](https://imjuni.github.io/jin-frame/packages)


![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg?style=flat-square)](https://npmcharts.com/compare/jin-frame?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/issues)
[![NPM version](https://img.shields.io/npm/v/jin-frame.svg?style=flat-square)](https://www.npmjs.com/package/jin-frame)
[![License](https://img.shields.io/npm/l/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)
[![code style: Biome](https://img.shields.io/badge/code_style-Biome-60a5fa.svg?style=flat-square)](https://biomejs.dev/)

**HTTP Request** = **TypeScript Class**

A reusable, declarative, type-safe, and extendable HTTP request library built on native `fetch`.

<!-- markdownlint-disable MD033 -->
<p align="center">
   <img src="assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
</p>
<!-- markdownlint-enable MD033 -->

Why `jin-frame`?

1. Declarative API Definition — HTTP requests as TypeScript classes with decorators
2. Type Safety — numeric `status` discriminated response unions with full TypeScript generics
3. Retry, Hooks, File Upload, Timeout, and AbortSignal support
4. Built on native `fetch` — no extra HTTP client dependency
5. RFC 6570 URI Template path parameters (`{param}`)
6. Builder pattern with compile-time field completeness checking
7. Inheritance-friendly — share host/auth in a base class, override path in subclasses
8. Runtime URL override — change host, pathPrefix, or path per `_execute()` call

## Release 6.0.0

Use `jin-frame` 6.0.0 with `@jin-frame/generator-cli` and `@jin-frame/generator-core` 1.0.0. When upgrading from 5.x, follow the [6.0 migration guide](https://imjuni.github.io/jin-frame/migration-v6).

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Version](#version)
- [Usage](#usage)
- [Decorators](#decorators)
  - [Method decorators](#method-decorators)
  - [Field decorators](#field-decorators)
- [Inheritance](#inheritance)
- [Builder Pattern](#builder-pattern)
- [Response status unions](#response-status-unions)
- [Retry, Timeout](#retry-timeout)
- [Authorization](#authorization)
- [validateStatus](#validatestatus)
- [Runtime URL Override](#runtime-url-override)
- [Naming Convention](#naming-convention)
- [OpenAPI Generator](#openapi-generator)
- [Requirements](#requirements)
- [Documentation](#documentation)
- [License](#license)

## Install

```sh
npm install jin-frame --save
```

```sh
yarn add jin-frame --save
```

```sh
pnpm add jin-frame --save
```

## Version

| Version | HTTP Client | Notes |
|---------|-------------|-------|
| < 5.0   | Axios       | Requires `axios` as a peer dependency |
| 5.x | native `fetch` | Previous response type API |
| 6.x | native `fetch` | Status-discriminated response unions; Node.js ^22.23.4 required |

## Usage

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

const frame = PokemonFrame.of({ name: 'pikachu', tid: randomUUID() });
const reply = await frame._execute();

if (reply.status === 200) {
  console.log(reply.data);
}
```

## Decorators

### Method decorators

| Decorator | Description |
|-----------|-------------|
| `@Get` | HTTP GET |
| `@Post` | HTTP POST |
| `@Put` | HTTP PUT |
| `@Patch` | HTTP PATCH |
| `@Delete` | HTTP DELETE |
| `@Head` | HTTP HEAD |
| `@Options` | HTTP OPTIONS |
| `@Retry` | Retry configuration |
| `@Timeout` | Request timeout |
| `@Dedupe` | Deduplicate concurrent identical requests |
| `@Security` | Security provider for authentication |
| `@Validator` | Response validators |

### Field decorators

| Decorator | Mapped to |
|-----------|-----------|
| `@Param` | URL path parameter (`{name}`) |
| `@Query` | URL query string |
| `@Body` | Request body field |
| `@ObjectBody` | Request body (entire object merged) |
| `@Header` | Request header |
| `@Cookie` | `Cookie` request header |

## Inheritance

Define shared settings (host, auth, pathPrefix, default field values) in a base class and override only the path in each subclass.

```ts
import { Get, Post, Param, Query, Header, Body, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({ host: 'https://pokeapi.co', pathPrefix: '/api/v2' })
class PokeApiFrame extends JinFrame {
  @Header({ replaceAt: 'X-Request-Id' })
  declare public readonly requestId: string;

  protected static override getDefaultValues() {
    return { requestId: randomUUID() };
  }
}

@Get({ path: '/pokemon/{name}' })
class GetPokemonFrame extends PokeApiFrame {
  @Param()
  declare public readonly name: string;
}

@Post({ path: '/pokemon' })
class CreatePokemonFrame extends PokeApiFrame {
  @Body()
  declare public readonly name: string;
}

// requestId is filled automatically by getDefaultValues
const frame = GetPokemonFrame.of({ name: 'pikachu' });
const reply = await frame._execute();
```

## Builder Pattern

`builder()` tracks which fields have been set at the type level. `build()` is only available once all public fields are assigned, catching missing fields at compile time.

```ts
const frame = PokemonFrame.builder()
  .set('name', 'pikachu')
  .set('tid', randomUUID())
  .build(); // compile error if any public field is missing

const reply = await frame._execute();
```

`of()` also accepts a builder callback:

```ts
const frame = PokemonFrame.of((b) => b.set('name', 'pikachu').set('tid', randomUUID()));
```

## Response status unions

`JinFrame` takes one `{ status, data }` response union. Checking `status` narrows the corresponding `data` type.

```ts
type PokemonResponse =
  | { status: 200; data: Pokemon }
  | { status: 404; data: ErrorBody };

class PokemonFrame extends JinFrame<PokemonResponse> {}

const reply = await frame._execute({ validateStatus: () => true });
if (reply.status === 200) {
  console.log(reply.data);
} else {
  console.error(reply.data);
}
```

### Generated response status unions

The OpenAPI generator combines documented numeric 2xx–5xx responses into a `{ status, data }` union passed as the single `JinFrame` type argument. Checking `status` narrows `data` to that response's type. Responses without a body use `undefined` data.

Non-2xx responses throw by default. Use `_execute({ validateStatus: () => true })` to receive error responses directly. The generated class always declares all documented numeric statuses. Without a call-level validator, the return type selects 2xx responses; `() => true` returns the full union. Use `validateStatus(200, 404)` to select specific statuses at runtime and in the return type. Range keys such as `2XX` and `default` are not included in the numeric literal union.

This is a breaking type API change. Migrate `JinFrame<DTO>` to `JinFrame<{ status: number; data: DTO }>` or a status-specific union. `JinPassResp` and `JinFailResp` are replaced by `JinResp<Response>`. Register status-specific validators with `validators: { 200: validator }`. Missing status validators produce a valid result.

## Retry, Timeout

```ts
@Timeout(2000)
@Retry({ max: 5, interval: 1000 })
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

`getInterval` supports exponential backoff:

```ts
@Retry({
  max: 5,
  getInterval: (retry) => Math.min(1000 * 2 ** retry, 30_000),
})
```

## Authorization

```ts
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  authorization: process.env.YOUR_KEY_HERE,
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

## validateStatus

`validateStatus` can be set at the decorator level or overridden per `_execute()` call:

```ts
// decorator-level default
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  validateStatus: (ok, status) => ok || status === 404,
})
export class PokemonFrame extends JinFrame { ... }

// _execute()-level override (takes precedence)
const reply = await frame._execute({
  validateStatus: (ok, status) => ok || status === 304,
});
```

## Runtime URL Override

`host`, `pathPrefix`, and `path` can be overridden per `_execute()` call:

```ts
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
  pathPrefix: '/v3',
  path: '/pokemon/{name}',
});
```

## Naming Convention

| Prefix | Used for |
|--------|----------|
| `#` | Internal state (JavaScript private fields) — invisible to subclasses |
| `_` | All instance methods — public API, hooks, and helpers |
| _(none)_ | Static methods |

See the full [Naming Convention](https://imjuni.github.io/jin-frame/method/naming-convention) documentation for details.

## OpenAPI Generator

The generator packages create type-safe `jin-frame` request classes from Swagger/OpenAPI v2 and OpenAPI v3 documents.

```sh
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0

frame-cli create ./openapi.yml --output ./generated
```

- [`@jin-frame/generator-cli`](packages/generator-cli/README.md): ESM executable for generating `paths.d.ts`, frames, base frames, and security providers.
- [`@jin-frame/generator-core`](packages/generator-core/README.md): ESM-only generation APIs for custom tooling and pipelines.

The generator packages require Node.js 22.23.4 or a later 22.x patch.

## jin-frame Requirements

- Node.js ^22.23.4
- TypeScript >= 5.0
- `experimentalDecorators` and `emitDecoratorMetadata` enabled in `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Documentation

The [documentation workspace](packages/docs/README.md) owns the guides and API references for all three packages. Use `pnpm docs:dev` locally and `pnpm docs:build` to build the site.

Full documentation: **[https://imjuni.github.io/jin-frame/](https://imjuni.github.io/jin-frame/)**

- [Getting Started](https://imjuni.github.io/jin-frame/getting-to-start)
- [Inheritance](https://imjuni.github.io/jin-frame/method/inheritance)
- [Builder Pattern](https://imjuni.github.io/jin-frame/method/builder)
- [URL Template (RFC 6570)](https://imjuni.github.io/jin-frame/method/url-template)
- [Form / File Upload](https://imjuni.github.io/jin-frame/method/form)
- [Retry](https://imjuni.github.io/jin-frame/method/retry)
- [Authorization](https://imjuni.github.io/jin-frame/method/authorization)
- [Validation](https://imjuni.github.io/jin-frame/method/validation)
- [Naming Convention](https://imjuni.github.io/jin-frame/method/naming-convention)

## License

This software is licensed under the [MIT](LICENSE).



## Errors Without an HTTP Response

`JinRespError.resp` is either a complete HTTP response or `undefined`. A network failure without a response does not create a synthetic response with `data`, `headers`, or `raw`. The original error is preserved in `cause`.

When an HTTP status is rejected, `resp` retains the actual response's `status`, `data`, `headers`, `raw`, and validation result. Without `resp`, the error-level `status` and `statusText` are diagnostic values. The defaults, `500` and `Internal Server Error`, do not mean that a server returned HTTP 500.

`validateStatus: () => true` still rejects on network failures. Hook or deserialization errors can also be wrapped in `JinRespError` without a response, so inspect `cause` rather than assuming every absent `resp` means a network outage.

```ts
import { JinRespError } from 'jin-frame';

try {
  await frame._execute();
} catch (error) {
  if (!(error instanceof JinRespError)) throw error;

  const response = error.resp;
  if (response === undefined) {
    console.error(error.message, error.cause);
  } else {
    console.error(response.status, response.data, response.headers);
  }
}
```
