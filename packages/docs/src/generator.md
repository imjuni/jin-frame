# OpenAPI Generator 1.0.0

`@jin-frame/generator-cli` 1.0.0 generates jin-frame 6.x clients from Swagger/OpenAPI v2 and OpenAPI v3 documents. Use Node.js ^22.23.4, TypeScript >= 6, and openapi-typescript >= 7.

```sh
pnpm add jin-frame@^6.0.0
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm exec frame-cli create ./openapi.yml --output ./generated
```

`create` generates types and frames together. `frame` generates frames from existing TypeScript type definitions. `template-eject` exports the default Eta templates for customization. Run `pnpm exec frame-cli <command> --help` for command options.

The CLI publishes an ESM executable named `frame-cli`. For programmatic generation, install `@jin-frame/generator-core@^1.0.0`, which publishes an ESM library and TypeScript declarations.

- [CLI commands and configuration](https://github.com/imjuni/jin-frame/blob/master/packages/generator-cli/README.md)
- [Core API and custom templates](https://github.com/imjuni/jin-frame/blob/master/packages/generator-core/README.md)
- [Response unions and migration](./migration-v6)


## Package guides

- [CLI installation](./generator-cli/) · [Commands](./generator-cli/commands) · [Configuration](./generator-cli/configuration)
- [Core installation](./generator-core/) · [Pipeline](./generator-core/pipeline) · [Configuration](./generator-core/configuration) · [Diagnostics](./generator-core/diagnostics)
