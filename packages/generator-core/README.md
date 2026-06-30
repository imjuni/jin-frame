# @jin-frame/generator-core

Core package for generating `jin-frame` request classes from an OpenAPI document.

`@jin-frame/generator-cli` uses this package internally. Use `generator-core` directly when you want to build a custom generation pipeline or integrate frame generation into another tool.

## Requirements

- Node.js 22 or later
- TypeScript 6 or later

## Installation

```sh
pnpm add -D @jin-frame/generator-core openapi-typescript ts-morph typescript
pnpm add jin-frame
```

`@jin-frame/generator-core` is used at generation time. `jin-frame` is required at runtime by the generated frames.

## Basic Flow

```ts
import fs from "node:fs/promises";
import pathe from "pathe";
import {
  convertor,
  createFrames,
  createOpenapiTs,
  load,
  renderOpenapiTs,
  safePathJoin,
  validate,
} from "@jin-frame/generator-core";

const specPath = "./openapi.yml";
const output = "./generated";

const loaded = await load(specPath);
if (loaded == null) {
  throw new Error(`Failed to load spec from ${specPath}`);
}

const validated = validate(loaded.data);
if (!validated.valid) {
  throw new Error("Invalid OpenAPI document");
}

const converted = await convertor(validated);
const nodes = await createOpenapiTs(converted.document, {
  version: 3,
  int64AsString: true,
});

const specTypeFilePath = pathe.join(output, "paths.d.ts");
await fs.mkdir(output, { recursive: true });
await fs.writeFile(specTypeFilePath, renderOpenapiTs(nodes));

const frames = await createFrames({
  document: converted.document,
  specTypeFilePath,
  specFilePath: specPath,
  output,
  useCodeFence: false,
  baseFrame: "ServerHostFrame",
});

for (const frame of frames) {
  const dirPath = safePathJoin(output, frame.frame.tag);
  const filePath = pathe.join(dirPath, frame.frame.filePath);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, frame.frame.source);
}
```

## Main APIs

| API | Description |
|---|---|
| `load()` | Loads an OpenAPI document from a local file or URL. JSON and YAML are supported. |
| `validate()` | Validates whether the document is OpenAPI v2 or v3. |
| `convertor()` | Converts Swagger/OpenAPI v2 documents to OpenAPI v3. |
| `createOpenapiTs()` | Runs `openapi-typescript` and returns TypeScript AST nodes. |
| `renderOpenapiTs()` | Renders the generated AST nodes as TypeScript source. |
| `createFrames()` | Generates frame source from an OpenAPI v3 document and a type definition path. |

## Generated Output

By default, the first operation tag is used as the directory name.

```text
generated/
├── paths.d.ts
├── ServerHostFrame.ts
├── securities/
│   └── ApiKeySecurityProvider.ts
├── pet/
│   ├── AddPetFrame.ts
│   └── GetPetByIdFrame.ts
└── store/
    └── GetInventoryFrame.ts
```

Operations without tags are generated directly under `output`.
Security provider files are generated when the document contains a supported security scheme.

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
const nodes = await createOpenapiTs(document, {
  version: 3,
  int64AsString: true,
});
```

This maps OpenAPI schemas with `type: integer` and `format: int64` or `format: i64` to TypeScript `string`.

## License

[MIT](LICENSE)
