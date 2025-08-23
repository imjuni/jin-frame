---
outline: deep
---

# Inheritance

`jin-frame`에서는 상속을 활용하여 공통 기능을 묶거나, 필요한 부분만 확장할 수 있습니다. 이를 통해 API 요청 구조를 간결하게 유지하면서도 다양한 엔드포인트에 유연하게 대응할 수 있습니다.

## Host와 Path 분리

MSA 아키텍처에서는 여러 서버와 통신해야 하는 경우가 많습니다. 이때 서버 주소(`host`)가 변경될 수 있기 때문에, `host`와 `path`를 분리해 관리하는 방식이 유용합니다.

### 부모 클래스 정의

```ts
import { randomUUID } from 'crypto';

@Get({ 
  host: 'https://pokeapi.co',
  timeout: 3_000
})
class PokemonAPI<PASS = unknown, FAIL = unknown> extends JinFrame<PASS, FAIL> {
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
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  public declare readonly name: string;
}
```

- 부모 클래스의 `host`와 `timeout`을 그대로 상속받습니다.  
- 자식 클래스에서는 `path`와 필요한 `param`만 정의하면 됩니다.

### Builder 패턴 사용

팩토리 메서드 `of`를 직접 사용할 경우, 타입 안정성을 위해 모든 필드를 명시해야 합니다. 이런 경우에는 Builder 패턴을 이용하면 훨씬 편리합니다.

```ts
// set 방식
const frame = PokemonByNameId.of(b => b.set('name', 'pikachu'));
const reply = await frame.execute();

// from 방식
const frame = PokemonByNameId.of(b => b.from({ name: 'pikachu' }));
const reply = await frame.execute();
```

---

## Timeout, Retry 설정 관리

자식 클래스에서 동일한 설정을 재정의하면 부모의 설정을 덮어씁니다. 이를 통해 엔드포인트별로 별도의 타임아웃이나 재시도 정책을 적용할 수 있습니다.

```ts
@Get({ 
  path: '/api/v2/pokemon/:name',
  timeout: 10_000,
  retry: { max: 5, interval: 1000 }
})
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  public declare readonly name: string;
}

@Get({ 
  path: '/api/v2/pokemon',
  timeout: 5_000,
})
class PokemonPaging extends JinFrame {
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
@Get({ 
  host: 'https://pokeapi.co',
  timeout: 3_000
})
class PokemonAPI<PASS = unknown, FAIL = unknown> extends JinFrame<PASS, FAIL> {
  @Query()
  public declare readonly tid: string;

  override async $_postHook(
    _req: TJinRequestConfig,
    reply: AxiosResponse<{ message: string }>,
    _debugInfo: IDebugInfo,
  ) {
    if (reply.status >= 400) {
      // 공통 에러 로깅 처리
    }
  }
}
```

Hook 함수명에 `$_` prefix가 붙는 이유는 `jin-frame` 내부 규칙상 필드 이름과 충돌을 피하기 위해 Hook과 내부 변수에는 `$_` 접두사가 붙습니다.

### 자식 클래스 Hook 확장

```ts
@Get({ 
  path: '/api/v2/pokemon/:name',
})
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  public declare readonly name: string;

  override async $_postHook(
    _req: TJinRequestConfig,
    reply: AxiosResponse<{ message: string }>,
    _debugInfo: IDebugInfo,
  ) {
    // 부모 Hook 실행
    await super.$_postHook(_req, reply, _debugInfo);

    // 추가적인 로깅이나 후처리
    ...
  }
}
```

---

## Conclusion

상속 기능을 활용하면 다음과 같은 장점을 얻을 수 있습니다.

- **공통 관리**: `host`, `timeout`, `hook`, `authorization` 등 반복되는 설정을 부모 클래스에 모아두어 관리 효율을 높일 수 있습니다.  
- **확장성 확보**: 자식 클래스에서는 필요한 필드(`path`, `param`)와 특수한 설정만 선언하여 손쉽게 확장할 수 있습니다.  
- **유연한 정책 적용**: 엔드포인트별로 별도 `timeout`, `retry` 정책을 적용할 수 있으며, 공통 Hook에 추가 로직을 덧붙여 세부 제어도 가능합니다.  
- **타입 안정성 보장**: Builder 패턴을 통해 필드 입력을 안전하게 유도하면서, 실수 가능성을 최소화할 수 있습니다.  

즉, 상속을 적절히 활용하면 공통 로직을 단순하게 유지하면서도, 엔드포인트별 특수성을 유연하게 반영할 수 있습니다.  
이를 통해 API 요청 구조를 **체계적이고 확장성 있게 관리할 수 있습니다**.
