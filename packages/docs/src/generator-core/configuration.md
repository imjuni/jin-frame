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



[All packages](../packages) · [Getting started](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)
