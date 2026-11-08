---
outline: deep
---

# Getting To Start

jin-frame 6.0.0은 Node.js ^22.23.4와 TypeScript >= 5.0을 사용합니다. 생성기 1.0.0은 TypeScript >= 6과 openapi-typescript >= 7이 필요합니다. [6.0 마이그레이션](./migration-v6)과 [OpenAPI 생성기](./generator)를 확인하세요.

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

Endpoint 별로 각종 설정을 다르게 적용할 수도 있습니다.

```ts
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

@Retry({ max: 3, interval: 1000 }) // Retry up to 3 times at 1-second intervals
@Timeout(2_000)  // 2-second timeout
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

jin-frame에서 Frame 클래스를 정의할 때는 필드에 보통 다음과 같이 `declare public readonly`를 사용합니다.

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly limit?: number;
}
```

- `declare`는 필드의 타입만 선언하고 JavaScript 필드 초기화 코드를 생성하지 않습니다. 값은 `of()`나 builder로 객체를 만들 때 설정합니다.
- `public`은 외부에서 접근할 수 있는 필드임을 명시합니다. TypeScript의 기본 접근 수준도 `public`입니다.
- `readonly`는 TypeScript 코드에서 필드 재할당을 막습니다. 런타임에 객체를 동결하거나 중첩된 값의 변경을 막지는 않습니다.

## Requirements

### Decorator

`tsconfig.json` 파일에서 experimentalDecorators, emitDecoratorMetadata option을 활성화 해주세요

```jsonc
{
  "compilerOptions": {
    // enable experimentalDecorators, emitDecoratorMetadata for using decorator
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```
