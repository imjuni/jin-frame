---
outline: deep
---

# Getting To Start

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
  path: '/api/v2/pokemon/:name',
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
  const reply = await frame.execute();
  
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
  path: '/api/v2/pokemon/:name',
})
export class PokemonDetailFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

## Why `declare public readonly`?

When defining Frame classes in jin-frame, fields typically use `declare public readonly`.

```ts
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly limit?: number;
}
```

### Reasons

1. **`declare`**  
   - In TypeScript, the `declare` keyword means “this field has no value assigned directly, but only its type is declared.”  
   - The actual value is injected at runtime by `jin-frame`, so there’s no need to initialize it inside the class.

2. **`public`**  
   - Explicitly specifies that the API field is an **input value** accessible from outside.

3. **`readonly`**  
   - Ensures immutability since the value should not change once defined.  
   - Example: `@Param() name` is injected at creation time and will not change during execution.

## Requirements

### Decorator

1. TypeScript
1. Decorator
   - Enable the `experimentalDecorators` and `emitDecoratorMetadata` options in your `tsconfig.json`.

```jsonc
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    // enable experimentalDecorators, emitDecoratorMetadata for using decorator
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```

### Axios version

| jin-frame | axios     |
| --------- | --------- |
| 2.x       | <= 0.27.x |
| 3.x       | >= 1.1.x  |
| 4.x       | >= 1.4.x  |

### Summary

`declare public readonly` ensures **type safety** and **immutability**, while letting jin-frame populate values automatically at runtime. This is the idiomatic pattern in jin-frame, and it is recommended to always use this syntax when defining fields.
