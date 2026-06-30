# @jin-frame/generator-cli

CLI package for generating `jin-frame` request classes from an OpenAPI document.

The CLI command name is `frame-cli`.

## Installation

```sh
pnpm add -D @jin-frame/generator-cli
pnpm add jin-frame
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
└── pet/
    ├── AddPetFrame.ts
    └── GetPetByIdFrame.ts
```

Swagger/OpenAPI v2 documents are also supported. They are converted to OpenAPI v3 internally before generation.

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

MIT
