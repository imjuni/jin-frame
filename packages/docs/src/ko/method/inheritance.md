---
outline: deep
---

# Inheritance

부모 프레임 클래스에 공통 설정과 훅을 정의합니다. 자식 클래스는 이를 상속받고 엔드포인트별 설정을 재정의할 수 있습니다.

## Host와 Path 분리

MSA 아키텍처에서는 여러 서버와 통신해야 하는 경우가 많습니다. 이때 서버 주소(`host`)가 변경될 수 있기 때문에, `host`와 `path`를 분리해 관리하는 방식이 유용합니다.

### 부모 클래스 정의

```ts
import { randomUUID } from 'crypto';

@Timeout(3_000)
@Get({ host: 'https://pokeapi.co' })
class PokemonAPI<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
  @Query()
  public declare readonly tid: string;

  protected static override getDefaultValues(): Partial<TFieldsOf<InstanceType<typeof PokemonAPI>>> {
    return { tid: randomUUID() };
  }
}
```

- 공통 설정: `host`, `timeout`
- 자동 필드 생성: `tid`를 UUID로 자동 입력하여 요청 추적에 활용할 수 있습니다.

### 자식 클래스 정의

```ts
type PokemonResponse =
  | { status: 200; data: IPokemonData }
  | { status: 404; data: { message: string } };
```

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends PokemonAPI<PokemonResponse> {
  @Param()
  public declare readonly name: string;
}
```

- 부모 클래스의 `host`와 `timeout`을 그대로 상속받습니다.
- 자식 클래스에서는 `path`와 필요한 `param`만 정의하면 됩니다.

### Builder 패턴 사용

`getDefaultValues()`가 제공하는 `tid`는 생략하고, 요청별 입력인 `name`을 builder 콜백으로 전달할 수 있습니다.

```ts
const frame = PokemonByNameId.of(b => b.set('name', 'pikachu'));
const reply = await frame._execute();

// Using from
const frame = PokemonByNameId.of(b => b.from({ name: 'pikachu' }));
const reply = await frame._execute();
```

---

## Timeout, Retry 설정 관리

자식 클래스에서 동일한 설정을 재정의하면 부모의 설정을 덮어씁니다. 이를 통해 엔드포인트별로 별도의 타임아웃이나 재시도 정책을 적용할 수 있습니다.

```ts
@Timeout(5_000)
@Get({ host: 'https://pokeapi.co' })
class PokeBaseFrame<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
}

@Retry({ max: 5, interval: 1000 }) // Add retries
@Timeout(10_000) // Override the 5-second timeout with 10 seconds
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends PokeBaseFrame<PokemonResponse> {
  @Param()
  public declare readonly name: string;
}

// Inherit the 5-second timeout
@Get({ path: '/api/v2/pokemon' })
class PokemonPaging extends PokeBaseFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}
```

- **PokemonByNameId**: 10초 타임아웃, 1초 간격으로 최대 5회 재시도
- **PokemonPaging**: 5초 타임아웃, 재시도 없음

---

## Hook 확장

상속 구조에서는 Hook 또한 확장 가능합니다. 이를 이용하면 공통 로깅이나 예외 처리 로직을 부모 클래스에 배치하고, 필요할 때 자식 클래스에서 보완할 수 있습니다.

### 부모 클래스 Hook 정의

```ts
@Timeout(3_000)
@Get({ host: 'https://pokeapi.co' })
class PokemonAPI<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
  @Query()
  public declare readonly tid: string;

  override async _postHook(
    _req: JinRequestConfig,
    reply: JinResp<OperationResponse>,
    _debugInfo: DebugInfo,
  ) {
    if (!reply.ok) {
      // Common error logging
    }
  }
}
```

Hook 함수명에 `_` 접두사가 붙는 이유는 모든 인스턴스 메서드에 `_`를 붙여 사용자가 선언한 필드 이름과의 충돌을 방지하기 위한 jin-frame의 네이밍 컨벤션 때문입니다. 전체 규칙은 [네이밍 컨벤션](./naming-convention.md)을 참고하세요.

### 자식 클래스 Hook 확장

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends PokemonAPI<PokemonResponse> {
  @Param()
  public declare readonly name: string;

  override async _postHook(
    _req: JinRequestConfig,
    reply: JinResp<PokemonResponse>,
    _debugInfo: DebugInfo,
  ) {
    // Run the parent hook
    await super._postHook(_req, reply, _debugInfo);

    if (reply.status === 200) {
      console.log(reply.data);
    }
  }
}
```
