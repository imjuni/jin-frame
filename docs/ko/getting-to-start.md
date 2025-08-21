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

## Requirements

1. TypeScript
1. Decorator
   - enable experimentalDecorators, emitDecoratorMetadata option in `tsconfig.json`

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

## Quick Example

```ts
@Get({ host: 'https://pokeapi.co/api/v2/pokemon/:name' })
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```
