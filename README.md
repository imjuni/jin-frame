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
   <img src="https://raw.githubusercontent.com/imjuni/jin-frame/master/assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
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
- [Retry, Timeout, Validation](#retry-timeout-validation)
  - [Retry](#retry)
  - [Timeout](#timeout)
  - [Validation](#validation)
- [Authorization](#authorization)
- [Response Validation and Errors](#response-validation-and-errors)
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
| 6.x | native `fetch` | Status-discriminated response unions; Node.js >=22.23.4 required |

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
@Get({
  host: 'https://pokeapi.co',
  pathPrefix: '/api/v2',
})
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

## Retry, Timeout, Validation

### Retry

Retry failed requests with a configurable interval.

```ts
import { Get, JinFrame, Retry } from 'jin-frame';

// Retry up to 5 times with a 1-second interval.
@Retry({
  max: 5,
  interval: 1000,
})
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/pikachu',
})
class RetryPokemonFrame extends JinFrame {}
```

### Timeout

Set the timeout in milliseconds.

```ts
import { Get, JinFrame, Timeout } from 'jin-frame';

// Abort each request attempt after 2 seconds.
@Timeout(2000)
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/pikachu',
})
class TimeoutPokemonFrame extends JinFrame {}
```

### Validation

Select a Zod schema by HTTP status (`pnpm add zod`).

```ts
import { z } from 'zod';
import { BaseValidator, Get, JinFrame, Validator } from 'jin-frame';
import type { ValidationInput, ValidationResult } from 'jin-frame';

const schemas: Partial<Record<number, z.ZodType>> = {
  200: z.object({ name: z.string() }),
};

class PokemonValidator extends BaseValidator {
  validator({ status, data }: ValidationInput): ValidationResult<string> {
    // Select the body schema for this HTTP status.
    const schema = schemas[status];

    // Leave statuses without a schema to the HTTP status policy.
    if (schema === undefined) {
      return { valid: true };
    }

    const result = schema.safeParse(data);

    return result.success
      ? { valid: true }
      : { valid: false, error: result.error.issues.map((issue) => issue.message) };
  }
}

// Throw JinValidationError when an accepted response fails validation.
@Validator(new PokemonValidator({ type: 'exception' }))
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/pikachu',
})
class ValidatedPokemonFrame extends JinFrame {}
```

## Authorization

Use a security provider to turn credentials into request headers.

```ts
import { BearerTokenProvider, Get, JinFrame } from 'jin-frame';

@Get({
  host: 'https://api.example.com', // Replace with your API host.
  path: '/me',
  // Read the current token whenever a request is built.
  security: new BearerTokenProvider(() => process.env.API_ACCESS_TOKEN ?? ''),
})
class GetProfileFrame extends JinFrame {}

const frame = GetProfileFrame.of();
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
`BearerTokenProvider` adds `Bearer` unless already present; without a token it adds no header.
An explicit `Authorization` header or call-level `auth` bypasses security providers.

## Response Validation and Errors

By default, `_execute()` returns 2xx responses and throws `JinRespError` for other statuses.
Pass `validateStatus` to `_execute()` or `_create()` to choose which statuses to accept.
It is not a decorator option.

```ts
import { JinRespError, validateStatus } from 'jin-frame';

try {
  // Accept 200 and 404; other HTTP statuses still throw JinRespError.
  const reply = await frame._execute({
    validateStatus: validateStatus(200, 404),
  });

  // A 404 is returned here as a normal response, not caught below.
  console.log(reply.status, reply.data);
} catch (error) {
  // Propagate errors that are not wrapped by jin-frame.
  if (!(error instanceof JinRespError)) {
    throw error;
  }

  // Check whether the error includes an HTTP response.
  const response = error.resp;

  if (response === undefined) {
    // Inspect the original cause of a network, hook, or deserialization failure.
    console.error(error.message, error.cause);
  } else {
    // Read the actual response, for example when its status was rejected.
    console.error(response.status, response.data, response.headers);
  }
}
```

`validateStatus: () => true` accepts every HTTP status, but cannot prevent network or
processing failures. An aborted caller signal also stops requests and retries, rejecting
with `JinRespError`; inspect `cause` for the abort reason. Without `error.resp`, no HTTP response is attached; use `cause`
to diagnose the failure rather than treating the error's status as a server response.

## jin-frame Requirements

- Node.js >=22.23.4
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

This software is licensed under the [MIT](./LICENSE).
