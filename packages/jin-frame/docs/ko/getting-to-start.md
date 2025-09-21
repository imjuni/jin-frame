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

@Retry({ max: 3, interval: 1000 }) // 재시도 최대 3번, 1000ms 간격
@Timeout(2_000)  // 타임아웃 2초
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

jin-frame에서 Frame 클래스를 정의할 때는 필드에 보통 다음과 같이 `declare public readonly`를 사용합니다.

```ts
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly limit?: number;
}
```

### 이유

1. **`declare`**
   - TypeScript에서 `declare` 키워드는 “이 필드는 실제 값이 할당되지 않지만, 타입만 정의된다”는 의미입니다.
   - 실제 값은 런타임에 `jin-frame`이 생성하여 주입하기 때문에, 클래스 내부에서 직접 초기화할 필요가 없습니다.

2. **`public`**
   - 접근 제어자를 명시적으로 작성하여 API 필드가 외부에서 접근 가능한 **입력값**임을 분명히 합니다.

3. **`readonly`**
   - 한번 정의된 값은 변경되지 않아야 하는 **불변 데이터**이므로, `readonly`로 지정하여 안전성을 높입니다.
   - 예: `@Param() name`은 생성 시점에만 주입되며, 실행 도중 변경되지 않습니다.

## Requirements

### Decorator

1. TypeScript
1. Decorator
   - `tsconfig.json` 파일에서 experimentalDecorators, emitDecoratorMetadata option을 활성화 해주세요

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

### 정리

`declare public readonly`는 **타입 안정성**과 **불변성**을 보장하면서도, 런타임에는 jin-frame이 알아서 값을 채워 넣도록 하기 위한 관용적 패턴입니다. 따라서 jin-frame을 사용할 때는 항상 이 구문을 함께 사용하는 것이 권장됩니다.
