# jin-frame

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg?style=flat-square)](https://npmcharts.com/compare/jin-frame?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/issues)
[![NPM version](https://img.shields.io/npm/v/jin-frame.svg?style=flat-square)](https://www.npmjs.com/package/jin-frame)
[![License](https://img.shields.io/npm/l/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**HTTP Request** = **TypeScript Class**

A reusable, declarative, type-safe, and extendable HTTP request library built on native `fetch`.

<!-- markdownlint-disable MD033 -->
<p align="center">
   <img src="assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
</p>
<!-- markdownlint-enable MD033 -->

Why `jin-frame`?

1. Declarative API Definition — HTTP requests as TypeScript classes with decorators
2. Type Safety — discriminated union response (`ok: true | false`) with full TypeScript generics
3. Retry, Hooks, File Upload, Timeout, and AbortSignal support
4. Built on native `fetch` — no extra HTTP client dependency
5. RFC 6570 URI Template path parameters (`{param}`)
6. Builder pattern with compile-time field completeness checking
7. Inheritance-friendly — share host/auth in a base class, override path in subclasses
8. Runtime URL override — change host, pathPrefix, or path per `_execute()` call

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [Decorators](#decorators)
- [Inheritance](#inheritance)
- [Builder Pattern](#builder-pattern)
- [Pass / Fail Response](#pass--fail-response)
- [Validation](#validation)
- [Retry, Timeout](#retry-timeout)
- [Authorization](#authorization)
- [validateStatus](#validatestatus)
- [Runtime URL Override](#runtime-url-override)
- [Naming Convention](#naming-convention)
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

if (reply.ok) {
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

Define shared settings (host, auth, pathPrefix) in a base class and override only the path in each subclass:

```ts
@Post({ host: 'https://api.example.com', pathPrefix: '/v2' })
class BaseApiFrame extends JinFrame {
  @Header({ replaceAt: 'Authorization' })
  declare public readonly token: string;
}

@Get({ path: '/pokemon/{name}' })
class PokemonFrame extends BaseApiFrame {
  @Param()
  declare public readonly name: string;
}
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

## Pass / Fail Response

`_execute()` returns a discriminated union typed by `ok`:

```ts
const reply = await frame._execute<MyFrame, Pokemon, ErrorBody>();

if (reply.ok) {
  console.log(reply.data); // typed as Pokemon
} else {
  console.error(reply.data); // typed as ErrorBody
}
```

## Validation

Validators run after the response is received and set `valid` and `$validated` on the response object. Pass and fail responses are validated independently.

```ts
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  validators: {
    pass: new MyPassValidator(),
    fail: new MyFailValidator(),
  },
})
export class PokemonFrame extends JinFrame<Pokemon, ErrorBody> { ... }

const reply = await frame._execute();
console.log(reply.valid);      // boolean — false if validator rejected
console.log(reply.$validated); // ValidationResult with details
```

Fail validators never throw `JinValidationError`. `JinValidationError` is only thrown when a **pass** validator rejects and its `type` is `'exception'`.

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

  @Query()
  declare public readonly tid: string;
}
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

  @Query()
  declare public readonly tid: string;
}
```

## validateStatus

`validateStatus` can be set at the decorator level as a default, or overridden per `_execute()` call. It receives both `ok` (native `Response.ok`) and the raw `status` code.

```ts
// decorator-level default
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  validateStatus: (ok, status) => ok || status === 404,
})
export class PokemonFrame extends JinFrame { ... }

// _execute()-level override (takes precedence over decorator)
const reply = await frame._execute({
  validateStatus: (ok, status) => ok || status === 304,
});
```

The default (`isValidateStatusDefault`) simply returns `ok`.

## Runtime URL Override

`host`, `pathPrefix`, and `path` can be overridden per `_execute()` call without changing the decorator:

```ts
// staging environment override
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
});

// override all three at once
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
  pathPrefix: '/v3',
  path: '/pokemon/{name}',
});
```

## Naming Convention

jin-frame applies a strict prefix strategy to avoid name collisions between user-defined fields and framework internals:

| Prefix | Used for |
|--------|----------|
| `#` | Internal state (JavaScript private fields) — invisible to subclasses |
| `_` | All instance methods — public API, hooks, and helpers |
| _(none)_ | Static methods |

See the full [Naming Convention](https://imjuni.github.io/jin-frame/method/naming-convention) documentation for details.

## Requirements

- Node.js >= 22
- TypeScript >= 5.0 (tested up to 6.0)
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

Full documentation is available at **[https://imjuni.github.io/jin-frame/](https://imjuni.github.io/jin-frame/)**.

- [Getting Started](https://imjuni.github.io/jin-frame/getting-to-start)
- [Inheritance](https://imjuni.github.io/jin-frame/method/inheritance)
- [Builder Pattern](https://imjuni.github.io/jin-frame/method/builder)
- [Form / File Upload](https://imjuni.github.io/jin-frame/method/form)
- [Retry](https://imjuni.github.io/jin-frame/method/retry)
- [Authorization](https://imjuni.github.io/jin-frame/method/authorization)
- [Validation](https://imjuni.github.io/jin-frame/method/validation)
- [Naming Convention](https://imjuni.github.io/jin-frame/method/naming-convention)

## License

This software is licensed under the [MIT](LICENSE).
