---
outline: deep
---

# Configuration

## Common Options

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  specFilePath: "./openapi.yml",
  output: "./generated",
  useCodeFence: false,
  baseFrame: "ServerHostFrame",
  // Default API host; endpoint overrides can replace it.
  host: "https://api.example.com",
  timeout: 60_000,
  overrides: {
    timeouts: {
      "/pets/{petId}": 3_000,
    },
    hosts: {
      "/pets/{petId}": "https://pet-api.example.com",
    },
    retries: {
      "/pets/{petId}": {
        max: 3,
        interval: 500,
      },
    },
  },
});
```

`overrides` keys must match the OpenAPI path keys exactly. For example, if the OpenAPI path is `"/pets/{petId}"`, use the same string as the override key.


## Host Strategies

`createFrames()` supports three host strategies:

- `string`: emits the resolved server URL directly.
- `function`: emits the identifier provided by `hostFunctionName`. Ensure the resolver is in scope in the generated code.
- `env-function`: emits an inline resolver based on `hostEnvVar` and `serverMapping`.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  hostStrategy: "env-function",
  hostEnvVar: "API_ENV",
  serverMapping: {
    development: "https://dev.api.example.com",
    production: "https://api.example.com",
  },
});
```

Relative OpenAPI server URLs are treated as path prefixes when possible.


## Security Providers

Provider subclasses are generated for OpenAPI `apiKey`, HTTP Bearer, and HTTP Basic security schemes. Root-level and operation-level security requirements are applied to generated frame decorators.

Use `securityProviderDir` to change the default `securities` directory. Use `securityProviders` to reference an application-defined provider for a specific scheme instead of generating one.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  securityProviderDir: "auth",
  // Map OpenAPI scheme names to application-owned provider classes.
  securityProviders: {
    oauth2: {
      className: "AppOAuthProvider",
      importPath: "../auth/AppOAuthProvider.js",
    },
  },
});
```

Each `securityProviders` key must match a security scheme name from the OpenAPI document.


## int64

Use `int64AsString` when 64-bit integer values should be handled as strings in JavaScript.

```ts
const source = await createOpenapiTs(document, {
  version: 3,
  int64AsString: true,
});
```

This maps OpenAPI schemas with `type: integer` and `format: int64` or `format: i64` to TypeScript `string`.



[All packages](../packages) · [Getting started](./index) · [Generation pipeline](./pipeline) · [Configuration](./configuration)

## Specification URL fallback

With no host override and absent or empty servers, use only the remote specification origin. /swagger/json locates the document, not the API. For example, a /health operation from http://localhost:7878/swagger/json targets http://localhost:7878/health. Explicit host/server paths and relative server URL resolution remain supported. Local specification files need server information or an explicit host.

## Generated provider constructors

Generated providers accept an optional key string or synchronous supplier. Update custom templates that previously passed a name as the first constructor argument. Without a constructor key, decorator authorization remains the fallback.

```ts
import { BearerTokenProvider } from 'jin-frame';

// Generated subclasses preserve the OpenAPI scheme name as metadata.
export class BearerAuthProvider extends BearerTokenProvider {
  constructor(key?: ConstructorParameters<typeof BearerTokenProvider>[0]) {
    super(key, 'bearerAuth');
  }
}

// Resolve the current key whenever a request is built.
const provider = new BearerAuthProvider(() => process.env.API_TOKEN ?? '');
```
