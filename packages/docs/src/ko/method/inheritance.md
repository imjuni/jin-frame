---
outline: deep
---

# Inheritance and defaults

공통 URL 설정과 field는 부모 프레임에 두고, 하위 class에서 엔드포인트별 option을 재정의합니다. 상속된 decorator field도 request 구성에 참여합니다.

## Typed defaults

정적 `this`로 자식 instance type를 자동 표현하지 않습니다. 부모 계약은 `object`를 반환하며, 오버라이드에 `Partial<PublicFieldsOf<class 이름>>`을 명시해 field 이름과 값을 검사합니다.

```ts twoslash
import { Get, Header, JinFrame, Param } from 'jin-frame';
import type { PublicFieldsOf } from 'jin-frame';

@Get({
  host: 'https://pokeapi.co',
  pathPrefix: '/api/v2',
})
class PokeApiFrame extends JinFrame {
  // Inherit the field and its HTTP header mapping.
  @Header({ replaceAt: 'X-Request-Id' })
  declare readonly requestId: string;

  protected static override getDefaultValues(): Partial<PublicFieldsOf<PokeApiFrame>> {
    // Generate a value when the factory applies defaults.
    return { requestId: crypto.randomUUID() };
  }
}

@Get({ path: '/pokemon/{name}' })
class PokemonFrame extends PokeApiFrame {
  @Param()
  declare readonly name: string;
}

// The callback supplies name while inherited defaults supply requestId.
const frame = PokemonFrame.of((b) => b.set('name', 'pikachu'));
const reply = await frame._execute();
```

## Merge order

constructor 실행 후 default value, 명시적인 Factory·Builder 값 순으로 적용합니다. 명시적 `undefined`도 default value를 덮어씁니다. default value로 제공하는 상속 field라도 `of()` object 인자에서는 필수 field로 남으므로 콜백을 사용하거나 값을 직접 전달합니다.

자식의 `getDefaultValues()`는 부모 메서드를 대체합니다. 둘 다 필요하면 `{ ...super.getDefaultValues(), ...childDefaults }`로 병합합니다. 프레임을 재사용하면 이미 할당된 default value를 유지하며 실행마다 재생성하지 않습니다.

## Response types

여러 response 계약에서 부모를 공유하려면 `Response extends { status: number; data: unknown }` 제네릭과 `JinFrame<Response>`를 사용합니다. 각 엔드포인트는 자신의 상태 코드·body 유니온을 선언합니다.
