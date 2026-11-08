---
outline: deep
---

# @jin-frame/generator-core

Version 1.0.0 targets `jin-frame` 6.x.


Core package for generating `jin-frame` request classes from an OpenAPI document.

`@jin-frame/generator-cli` uses this package internally. Use `generator-core` directly when you want to build a custom generation pipeline or integrate frame generation into another tool.


## Package Format

`@jin-frame/generator-core` is an ESM-only package. Use ESM `import`; CommonJS `require()` is not supported.

The published package contains the ESM runtime bundle and TypeScript declarations:

```text
dist/
├── esm/index.mjs
└── types/index.d.ts
```


## Requirements

- Node.js 22.23.4 or a later 22.x patch
- TypeScript 6 or later


## Installation

```sh
pnpm add -D @jin-frame/generator-core@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0
```

`@jin-frame/generator-core` is used at generation time. `jin-frame` is required at runtime by the generated frames.



[All packages](../packages) · [Getting started](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)

## API reference

Public functions, interfaces, and types are generated from source with TypeDoc. [generator-core API](/api/generator-core/)
