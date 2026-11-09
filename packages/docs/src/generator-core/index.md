---
outline: deep
---

# @jin-frame/generator-core

## Introduction

A library for generating `jin-frame` request classes and TypeScript types from an OpenAPI document. It also powers `@jin-frame/generator-cli`.

Version 1.0.0 targets `jin-frame` 6.x.

## Why generator-core?

- **Add code generation to your own tools.** Call the generation APIs directly from TypeScript or JavaScript.
- **Compose a generation pipeline.** Connect document loading, validation, conversion, type generation, and frame generation in your own workflow.
- **Control output and observe generation.** Adjust output through options and custom templates, and receive progress and diagnostics through event observers.

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



[All packages](../packages) · [Getting started](./index) · [Generation pipeline](./pipeline) · [Configuration](./configuration)

## API reference

Public functions, interfaces, and types are generated from source with TypeDoc. [generator-core API](/api/generator-core/)
