# jin-frame

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg?style=flat-square)](https://npmcharts.com/compare/jin-frame?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/issues)
[![NPM version](https://img.shields.io/npm/v/jin-frame.svg?style=flat-square)](https://www.npmjs.com/package/jin-frame)
[![License](https://img.shields.io/npm/l/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)
[![code style: Biome](https://img.shields.io/badge/code_style-Biome-60a5fa.svg?style=flat-square)](https://biomejs.dev/)

## Introduction

**1 HTTP Request** = **1 TypeScript Class**

Define HTTP requests as TypeScript classes and send them using native `fetch`.

<!-- markdownlint-disable MD033 -->
<p align="center">
   <img src="../../assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
</p>
<!-- markdownlint-enable MD033 -->

## Why jin-frame?

- **Define HTTP APIs as TypeScript classes.** Declare the HTTP method, endpoint, timeout, retry policy, and security settings alongside the request fields.
- **Configure each API for production use.** Set different timeouts, retry policies, and other request options for endpoints with different operational requirements.
- **Validate responses and deduplicate requests.** Use validators to check response data and request deduplication to share a single network call among identical concurrent requests.
- **Organize API settings through inheritance.** Define shared settings in base classes and override them in subclasses to reflect your API hierarchy.

## Table of Contents <!-- omit in toc -->

- [Introduction](#introduction)
- [Why jin-frame?](#why-jin-frame)
- [Install](#install)
- [Version](#version)
- [Usage](#usage)
- [Inheritance](#inheritance)
- [Builder Pattern](#builder-pattern)
- [Response status unions](#response-status-unions)
  - [Generated response status unions](#generated-response-status-unions)
- [Retry, Timeout](#retry-timeout)
- [Authorization](#authorization)
- [validateStatus](#validatestatus)
- [Runtime URL Override](#runtime-url-override)
- [Errors Without an HTTP Response](#errors-without-an-http-response)
- [Naming Convention](#naming-convention)
- [OpenAPI Generator](#openapi-generator)
- [jin-frame Requirements](#jin-frame-requirements)
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

The following example defines a request and fetches a Pokémon by name.
Run it in a TypeScript ESM project with `experimentalDecorators` enabled and top-level `await` support.

```ts
import { Get, Param, JinFrame } from 'jin-frame';

// Define an HTTP GET request with a decorator.
@Get({
  // Set the API endpoint.
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  // Map this field to the name parameter in the URL path.
  @Param()
  declare public readonly name: string;
}

// Create a request instance using the static factory.
const frame = PokemonFrame.of({ name: 'pikachu' });
// Send the request and read the response.
const reply = await frame._execute();

console.log(reply.data);
```

## Inheritance

Define shared settings (host, auth, pathPrefix, default field values) in a base class and override only the path in each subclass.

```ts
import { Get, Post, Param, Header, Body, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

// Share the host and URL prefix across subclasses.
@Get({ host: 'https://pokeapi.co', pathPrefix: '/api/v2' })
class PokeApiFrame extends JinFrame {
  // Map the inherited field to the X-Request-Id header.
  @Header({ replaceAt: 'X-Request-Id' })
  declare public readonly requestId: string;

  // Generate a default request ID unless an explicit value is supplied.
  protected static override getDefaultValues() {
    return { requestId: randomUUID() };
  }
}

// Override the path while inheriting the host and prefix.
@Get({ path: '/pokemon/{name}' })
class GetPokemonFrame extends PokeApiFrame {
  // Substitute this value for {name} in the URL path.
  @Param()
  declare public readonly name: string;
}

// Illustrate a POST override; PokeAPI does not support creating Pokémon.
@Post({ path: '/pokemon' })
class CreatePokemonFrame extends PokeApiFrame {
  // Serialize this field into the request body rather than the URL path.
  @Body()
  declare public readonly name: string;
}

// Supply name through the callback and use the inherited default request ID.
const frame = GetPokemonFrame.of((b) => b.set('name', 'pikachu'));
// Send the GET request with the generated X-Request-Id header.
const reply = await frame._execute();
console.log(reply.data);
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

This is a breaking type API change. Migrate `JinFrame<DTO>` to `JinFrame<{ status: number; data: DTO }>` or a status-specific union. `JinPassResp` and `JinFailResp` are replaced by `JinResp<Response>`. Register a single `validator: new ApiValidator()` receiving the complete response union, and select schemas by status inside the validator.

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

Use a security provider to turn credentials into request headers.

```ts
import { BearerTokenProvider, Get, JinFrame } from 'jin-frame';

// Read the current token whenever a request is built.
const bearer = new BearerTokenProvider(() => process.env.API_ACCESS_TOKEN ?? '');

@Get({
  host: 'https://api.example.com', // Replace with your API host.
  path: '/me',
  security: bearer,
})
class GetProfileFrame extends JinFrame {}

const frame = GetProfileFrame.of({});
// Sends Authorization: Bearer <current token>.
const reply = await frame._execute();
console.log(reply.data);

// Override the token for this call without updating the shared provider.
await frame._execute({ dynamicAuth: 'per-request-access-token' });
```

`ApiKeyProvider(key, keyName, location)` accepts a string or synchronous key supplier.
`BasicAuthProvider(key)` and `BearerTokenProvider(key)` specialize its Authorization header.
Basic keys must already be Base64-encoded, for example `new BasicAuthProvider(() => btoa("user:pass"))`.
Token priority is `dynamicAuth` → provider key → decorator `authorization`.
`BearerTokenProvider` adds `Bearer ` unless already present; without a token it adds no header.
An explicit `Authorization` header or call-level `auth` bypasses security providers.

## validateStatus

Pass `validateStatus` to `_execute()` or `_create()`. Version 6.0 does not accept it in decorator options. By default, 2xx responses are returned and other HTTP statuses throw `JinRespError`.

```ts
import { validateStatus } from 'jin-frame';

const reply = await frame._execute({
  validateStatus: validateStatus(200, 404),
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

## Naming Convention

| Prefix | Used for |
| -------- | ---------- |
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

- [`@jin-frame/generator-cli`](../generator-cli/README.md): ESM executable for generating `paths.d.ts`, frames, base frames, and security providers.
- [`@jin-frame/generator-core`](../generator-core/README.md): ESM-only generation APIs for custom tooling and pipelines.

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

This software is licensed under the [MIT](../../LICENSE).
