---
outline: deep
---

# Generation pipeline

## Basic Flow

```ts
import fs from "node:fs/promises";
import pathe from "node:path";
import {
  convertor,
  createFrames,
  createOpenapiTs,
  load,
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
const source = await createOpenapiTs(converted.document, {
  version: 3,
  int64AsString: true,
});

const specTypeFilePath = pathe.join(output, "paths.d.ts");
await fs.mkdir(output, { recursive: true });
await fs.writeFile(specTypeFilePath, source);

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
| `createOpenapiTs()` | Runs `openapi-typescript` and returns TypeScript source as a string. |
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



[All packages](../packages) · [Getting started](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)
