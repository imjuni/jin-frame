---
outline: deep
---

# Getting started

jin-frame 6은 HTTP request를 class로 정의하고 네이티브 `fetch`로 실행합니다. request를 보내는 애플리케이션에 런타임을 설치합니다. 생성기는 선택적인 개발 도구입니다.

## Install

```sh
pnpm add jin-frame@^6
pnpm add -D typescript
```

패키지는 Node.js `>=22.23.4`, TypeScript >= 5를 요구합니다. 레거시 decorator를 켜고 TypeScript로 컴파일합니다. Node의 type 제거 기능만으로는 decorator를 변환할 수 없습니다.

## TypeScript configuration

```jsonc
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

최상위 await 예제는 package.json에 `"type": "module"`을 설정합니다. `tsc`로 컴파일한 JavaScript를 Node로 실행합니다.

## First request

식별자에 마우스를 올리면 type와 설명을 볼 수 있습니다. 이 예제는 공개 PokeAPI를 호출합니다. 다른 문서의 `api.example.com` 주소는 자신의 서버 주소로 교체해야 합니다.

```ts twoslash
import { Get, JinFrame, Param } from 'jin-frame';

/** A successful Pokémon detail response. */
type PokemonReply = { status: 200; data: { name: string; id: number } };

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
class PokemonFrame extends JinFrame<PokemonReply> {
  // Bind this field to the URL placeholder.
  @Param()
  declare readonly name: string;
}

// Create an instance with the required request field.
const frame = PokemonFrame.of({ name: 'pikachu' });
const reply = await frame._execute();

// The response union determines the body type; it does not validate server data.
console.log(reply.data.name);
```

## Declaring fields

`declare`는 field 초기화 코드 생성을 막습니다. `readonly`는 TypeScript 재할당을 제한하며 중첩 object를 동결하지 않습니다. 선택 field는 `?`로 선언하고 생략할 수 있습니다. 필수 공개 field가 없으면 `Frame.of()`로 생성합니다.

[HTTP Methods](./usage-method), [Builder](./method/builder), [response 검증](./method/validation)을 이어서 확인하세요.
