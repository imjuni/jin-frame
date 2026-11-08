---
outline: deep
---

# @jin-frame/generator-cli

Version 1.0.0 targets `jin-frame` 6.x.


CLI package for generating `jin-frame` request classes from an OpenAPI document.

The CLI command name is `frame-cli`.


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
