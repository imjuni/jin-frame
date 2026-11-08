---
outline: deep
---

# Commands

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


## OpenAPI TypeScript Options

The `create` command can pass some `openapi-typescript` options with the `oat-*` prefix.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --oat-alphabetize \
  --oat-export-type
```

Run `frame-cli create --help` to see the available options.



[All packages](../packages) · [Getting started](./index) · [명령어](./commands) · [Configuration](./configuration)
