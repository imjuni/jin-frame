---
outline: deep
---

# Getting Started

## Installation

npm

```sh
npm install jin-frame --save
```

yarn

```sh
yarn add jin-frame
```

pnpm

```sh
pnpm add jin-frame
```

## Requirements

- TypeScript 5+
- Decorators enabled
  - Set `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
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

// Execute request
const result = await PokemonFrame.of({ name: 'pikachu', tid: '123' }).execute();
console.log(result.data);
```

## Customization Examples

You can configure each endpoint differently depending on your requirements.

```ts
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon',
  timeout: 10_000, // 10s timeout
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare public readonly limit: number;

  @Query()
  declare public readonly offset: number;
}

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/:name',
  timeout: 2_000, // 2s timeout
  retry: { max: 3, interval: 1000 }, // retry up to 3 times, 1s interval
})
export class PokemonDetailFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

## Next Steps

- **Query / Body / Param / Header**  
