# @jin-frame/generator-cli

`@jin-frame/generator-cli` generates `jin-frame` request classes from an OpenAPI document.

The CLI is intentionally a thin input layer:

1. Parse command-line arguments.
2. Load `jin-frame.config.*` with `c12`.
3. Normalize endpoint override options into objects.
4. Pass the normalized data to `@jin-frame/generator-core`.

Generation rules and output behavior live in `@jin-frame/generator-core`.

## Commands

### create

Generate OpenAPI TypeScript definitions and `jin-frame` classes.

```sh
jin-frame-generator create ./openapi.yml --output ./generated
```

### frame

Generate only `jin-frame` classes from an existing `openapi-typescript` definition file.

```sh
jin-frame-generator frame ./openapi.yml --type ./generated/paths.d.ts --output ./generated
```

## Config File

The CLI loads `jin-frame.config.*` automatically from the current working directory. You can also pass an explicit config file:

```sh
jin-frame-generator create ./openapi.yml --output ./generated --config ./jin-frame.config.ts
```

Example:

```ts
export default {
  host: "https://api.example.com",
  timeout: 60_000,
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
      useRetryAfter: true,
    },
  },
};
```

Endpoint override keys must match the OpenAPI path key exactly, such as `"/pets/{petId}"`.

## Endpoint Overrides

Endpoint overrides can be passed through repeated CLI options.

```sh
jin-frame-generator create ./openapi.yml \
  --output ./generated \
  --timeout "/pets/{petId}=3000" \
  --host "/pets/{petId}=https://pet-api.example.com" \
  --retry '/pets/{petId}={"max":3,"interval":500}'
```

The CLI converts these arguments into the same object shape as the config file:

```ts
{
  timeouts: {
    "/pets/{petId}": 3000,
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
}
```

## Precedence

CLI values override config file values. For endpoint overrides, CLI entries override config entries for the same OpenAPI path.

```text
CLI endpoint override > config endpoint override > CLI global option > config global option > default
```

## Generated Output

Endpoint overrides are applied by `@jin-frame/generator-core`.

- `timeouts[path]` generates `@Timeout(...)` on the endpoint frame.
- `retries[path]` generates `@Retry(...)` on the endpoint frame.
- `hosts[path]` writes `host` into the method decorator for that endpoint.

When a base frame is enabled, an endpoint host override still writes `host` directly to the endpoint method decorator so it can override the shared base host.
