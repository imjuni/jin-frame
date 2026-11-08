---
outline: deep
---

# Configuration

## Config File

The CLI looks for `frame-cli.config.*` in the current working directory. You can also pass an explicit config file with `--config`.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --config ./frame-cli.config.ts
```

Example:

```ts
export default {
  host: "https://api.example.com",
  timeout: 60_000,
  baseFrame: "ServerHostFrame",
  int64AsString: true,
};
```

CLI options take precedence over config file values.


## Main Options

| Option | Description |
|---|---|
| `--output`, `-o` | Directory for generated files. |
| `--type`, `-t` | Path to `paths.d.ts` for the `frame` command. |
| `--config` | Config file path. |
| `--host`, `-H` | Default host or endpoint host override. |
| `--timeout` | Default timeout or endpoint timeout override. |
| `--retry` | Endpoint retry override. |
| `--base-frame` | Base frame class name to generate. |
| `--int64-as-string` | Maps OpenAPI `integer` + `int64`/`i64` schemas to TypeScript `string`. |
| `--host-strategy` | Host generation strategy: `string`, `function`, or `env-function`. |
| `--host-env-var` | Environment variable used by `env-function`. Defaults to `NODE_ENV`. |
| `--host-function-name` | Function identifier emitted by the `function` strategy. |
| `--host-function-import` | Module specifier that exports the resolver used by `function` strategy. |
| `--server-mapping` | Environment-to-server mapping as a JSON object. |
| `--security-provider-dir` | Directory for generated security provider classes. |


## Endpoint Override

You can apply host, timeout, and retry options to specific endpoints.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --timeout "/pets/{petId}=3000" \
  --host "/pets/{petId}=https://pet-api.example.com" \
  --retry '/pets/{petId}={"max":3,"interval":500}'
```

The same values can be set in a config file.

```ts
export default {
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
};
```

Override keys must match the OpenAPI path keys exactly.


## Host Strategy

The default `string` strategy writes the resolved server URL directly into the generated frame.

Use `function` when the generated frame should reference a host resolver defined by your application.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy function \
  --host-function-name getApiHost \
  --host-function-import ./apiHost.js
```

Use `env-function` to generate an inline resolver based on an environment variable.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy env-function \
  --host-env-var API_ENV \
  --server-mapping '{"development":"https://dev.api.example.com","production":"https://api.example.com"}'
```

Relative OpenAPI server URLs are treated as path prefixes when possible.

Generated paths and collisions are validated before files are staged and applied. A manifest removes files that became
stale after a later generation while preserving files that were not created by the CLI.


## Security Providers

The generator creates provider subclasses for OpenAPI `apiKey`, HTTP Bearer, and HTTP Basic security schemes. Root-level and operation-level security requirements are applied to generated frame decorators.

Generated providers are written to `securities` by default. Use `--security-provider-dir` to change the directory.

Custom providers can be mapped in the config file. Each key must match a security scheme name from the OpenAPI document.

```ts
export default {
  securityProviderDir: "auth",
  securityProviders: {
    oauth2: {
      className: "AppOAuthProvider",
      importPath: "../auth/AppOAuthProvider.js",
    },
  },
};
```



[All packages](../packages) · [Getting started](./index) · [명령어](./commands) · [Configuration](./configuration)

## Specification URL fallback

With no host override and absent or empty servers, use only the remote specification origin. /swagger/json locates the document, not the API. For example, a /health operation from http://localhost:7878/swagger/json targets http://localhost:7878/health. Explicit host/server paths and relative server URL resolution remain supported. Local specification files need server information or an explicit host.
