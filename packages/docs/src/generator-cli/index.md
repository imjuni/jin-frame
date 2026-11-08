---
outline: deep
---

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



[All packages](../packages) · [Getting started](./index) · [명령어](./commands) · [Configuration](./configuration)
