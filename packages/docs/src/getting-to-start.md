---
outline: deep
---

# Getting To Start

jin-frame 6.0.0 requires Node.js ^22.23.4 and TypeScript >= 5.0. Generator 1.0.0 requires TypeScript >= 6 and openapi-typescript >= 7. See [Migrating to 6.0](./migration-v6) and the [OpenAPI generator](./generator).

## Installation

npm

```sh
npm install jin-frame --save
```

yarn

```sh
yarn add jin-frame --save
```

pnpm

```sh
pnpm add jin-frame --save
```

## Quick Example

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

(async () => {
  const frame = PokemonFrame.of({
    name: 'pikachu',
    tid: randomUUID(),
  });
  const reply = await frame._execute();

  // Show Pikachu Data
  console.log(reply.data);
})();
```

## Customization Examples

You can apply different settings for each endpoint.

```ts
import { Get, Param, Query, JinFrame, Timeout, Retry } from 'jin-frame';

@Timeout(10_000)  // 10s timeout
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon',
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare public readonly limit: number;

  @Query()
  declare public readonly offset: number;
}

@Retry({ max: 3, interval: 1000 }) // retry up to 3 times, 1s interval
@Timeout(2_000)  // 2s timeout
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonDetailFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

## Why `declare public readonly`?

When defining Frame classes in jin-frame, fields typically use `declare public readonly`.

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly limit?: number;
}
```

- `declare` supplies the field type without emitting JavaScript field initialization. Values are assigned when `of()` or the builder creates the instance.
- `public` makes external access explicit. It is also TypeScript's default visibility.
- `readonly` prevents field reassignment in TypeScript code. It does not freeze the object at runtime or prevent mutations to nested values.

## Requirements

### Decorator

Enable the `experimentalDecorators` and `emitDecoratorMetadata` options in your `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // enable experimentalDecorators, emitDecoratorMetadata for using decorator
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```
