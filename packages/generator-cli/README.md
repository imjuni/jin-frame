# @jin-frame/generator-cli

## Introduction

A CLI for generating `jin-frame` request classes and TypeScript types from an OpenAPI document. The command name is `frame-cli`.

Version 1.0.0 targets `jin-frame` 6.x.

## Why generator-cli?

- **Generate request code from an OpenAPI specification.** Use `create` to generate type definitions and frames together.
- **Use existing type definitions.** Use `frame` to generate frames that reference types you have already generated.
- **Keep generation settings with your project.** Configure output paths and request options in a config file, and customize generated code with your own templates.

## Package Format

`@jin-frame/generator-cli` is an executable-only package. It publishes the ESM executable `frame-cli` and does not expose a library API or TypeScript declarations.

```text
dist/
└── cli.mjs
```

## Requirements

- Node.js 22.23.4 or a later 22.x patch
- TypeScript 6 or later

## Installation

```sh
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0
```

## create

Generate both `paths.d.ts` and frame files from an OpenAPI document.

```sh
frame-cli create ./openapi.yml --output ./generated
```

The generated output usually looks like this:

```text
generated/
├── paths.d.ts
├── ServerHostFrame.ts
├── securities/
│   └── ApiKeySecurityProvider.ts
└── pet/
    ├── AddPetFrame.ts
    └── GetPetByIdFrame.ts
```

Swagger/OpenAPI v2 documents are also supported. They are converted to OpenAPI v3 internally before generation.
OpenAPI 3.0 and 3.1 documents are supported. OpenAPI 3.1 schemas are preserved during type generation.
The `securities` directory is generated when the document contains a supported security scheme.

Query array serialization supports `form`, `spaceDelimited`, and `pipeDelimited`. Serialization styles that
cannot currently be represented by `jin-frame`, including `deepObject` and path `matrix` or `label`, fail with a
clear generation error.

## frame

Generate only frame files when you already have an `openapi-typescript` type definition file.

```sh
frame-cli frame ./openapi.yml \
  --type ./generated/paths.d.ts \
  --output ./generated
```

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

## OpenAPI TypeScript Options

The `create` command can pass some `openapi-typescript` options with the `oat-*` prefix.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --oat-alphabetize \
  --oat-export-type
```

Run `frame-cli create --help` to see the available options.

## License

[MIT](LICENSE)

## Specification URL versus API server URL

When servers is absent or empty, only the remote specification URL origin is used as the API host. Loading http://localhost:7878/swagger/json makes a /health operation target http://localhost:7878/health. The document path, query, and fragment are not API prefixes. Explicit host and servers[].url paths are preserved, and relative server URLs resolve against the specification URL. Local files without server information require an explicit host.
