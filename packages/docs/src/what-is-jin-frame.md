# What is jin-frame?

## Introduction

jin-frame defines HTTP requests as TypeScript classes and sends them using native `fetch`. Decorators map class fields to path parameters, query strings, headers, and request bodies.

Use a frame class to keep an endpoint's URL, input fields, timeout, and retry settings together. A base class can hold settings shared by several endpoints, such as the host and authentication.

## Why jin-frame?

- **Define HTTP APIs as TypeScript classes.** Declare the HTTP method, endpoint, timeout, retry policy, and security settings alongside the request fields.
- **Configure each API for production use.** Set different timeouts, retry policies, and other request options for endpoints with different operational requirements.
- **Validate responses and deduplicate requests.** Use validators to check response data and request deduplication to share a single network call among identical concurrent requests.
- **Organize API settings through inheritance.** Define shared settings in base classes and override them in subclasses to reflect your API hierarchy.

## Request and response types

`of()` creates a request from the class's declared fields. For APIs with different response bodies per status, declare a `{ status, data }` union and check `status` to narrow `data`.

Type declarations do not validate server responses at runtime. Register a [response validator](./method/validation) when you need to check returned data against a schema.

## Per-endpoint settings

The list request below has a 10-second timeout. The detail request has a 2-second timeout and retries up to three times at 1-second intervals.

```ts
import { Get, JinFrame, Param, Query } from 'jin-frame';

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon',
  timeout: 10_000, // 10 seconds
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  timeout: 2_000, // 2 seconds
  retry: { max: 3, interval: 1000 }, // retry up to 3 times, 1s interval
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

## Shared request behavior

- [Hooks](./method/hook) run before or after requests and during retries.
- [Inheritance](./method/inheritance) shares settings and hooks across frame classes.
- [Form data](./method/form) supports URL-encoded fields and multipart file uploads.
- [Mocking](./method/mocking) uses MSW to intercept requests in tests without calling an API server.

Request classes can also be exported from a package and used by multiple projects. See [Getting started](./getting-to-start) for installation and execution examples.
