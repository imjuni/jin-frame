---
outline: deep
---

# Builder 패턴

`JinFrame`은 생성자 없이 프레임 인스턴스를 만들 수 있는 두 가지 정적 팩토리 메서드 — `builder()`와 `of()` — 를 제공합니다. 두 메서드 모두 TypeScript의 팬텀 타입 추적을 활용해 누락된 필드를 **컴파일 타임**에 잡아냅니다.

## of()

`of()`는 일반 객체 또는 빌더 콜백으로 인스턴스를 생성합니다. 프레임을 만드는 가장 간단한 방법입니다.

### 일반 객체

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;

  @Query()
  declare public readonly expand?: string;
}

const frame = GetUserFrame.of({ id: '123', expand: 'roles' });
const reply = await frame._execute();
```

### 빌더 콜백

```ts
const frame = GetUserFrame.of((b) =>
  b.set('id', '123').set('expand', 'roles'),
);
```

---

## builder()

`builder()`는 `BuilderFor<C>` 객체를 반환합니다. 팬텀 타입 파라미터 `TSet`이 set한 키를 누적하며, **모든 공개 필드가 할당된 뒤에만 `build()`가 호출 가능**해집니다. 필드를 빠뜨리면 런타임이 아닌 컴파일 에러로 즉시 알 수 있습니다.

```ts
const frame = GetUserFrame.builder()
  .set('id', '123')
  .set('expand', 'roles')
  .build(); // ✅ 모든 필드 설정 완료 — build() 호출 가능

const frame2 = GetUserFrame.builder()
  .set('expand', 'roles')
  .build(); // ❌ 컴파일 에러: 'id' 누락
```

### 체인 메서드

| 메서드          | 설명                                                           |
| --------------- | -------------------------------------------------------------- |
| `.set(k, v)`    | 공개 필드 하나를 설정. `k`에서 `v`의 타입이 자동 추론됩니다.   |
| `.from(obj)`    | 부분 객체로 여러 필드를 한 번에 설정합니다.                    |
| `.auto()`       | `getDefaultValues()`에서 정의한 클래스 기본값을 적용합니다.    |
| `.get()`        | 빌드 없이 현재 필드 스냅샷을 반환합니다.                       |
| `.build()`      | 프레임을 인스턴스화합니다. 모든 필드가 설정된 후에만 호출 가능. |

```ts
const frame = GetUserFrame.builder()
  .auto()               // 기본값 먼저 적용
  .from({ id: '123' }) // 이후 덮어쓰기
  .build();
```

---

## 생성자 인자

생성자에 인자가 필요한 프레임은 `of()`에서 필드 객체 뒤에, `builder()`에서는 첫 번째 인자로 넘깁니다.

```ts
@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class AuthedFrame extends JinFrame<User> {
  constructor(private readonly tenant: string) {
    super();
  }

  @Param()
  declare public readonly id: string;
}

// of() — 필드 객체 먼저, 생성자 인자는 그 뒤
const frame = AuthedFrame.of({ id: '123' }, 'acme');

// builder() — 생성자 인자를 builder()에 전달
const frame2 = AuthedFrame.builder('acme').set('id', '123').build();
```

---

## 기본값 설정

정적 메서드 `getDefaultValues()`를 오버라이드하면 `auto()`와 `build()` 시 자동으로 적용될 기본값을 제공할 수 있습니다.

```ts
@Get({ host: 'https://api.example.com', path: '/users' })
class ListUsersFrame extends JinFrame<User[]> {
  @Query()
  declare public readonly page: number;

  @Query()
  declare public readonly limit: number;

  protected static override getDefaultValues() {
    return { page: 1, limit: 20 };
  }
}

const frame = ListUsersFrame.builder()
  .auto()         // page=1, limit=20 기본값 적용
  .set('page', 3) // page 덮어쓰기
  .build();
```

---

## 타입 안전성 상세

`builder()`와 `of()`가 사용하는 `PublicFieldsOf<T>` 타입은 다음을 자동으로 제외합니다:

- 메서드 (함수 타입 프로퍼티)
- `_` 접두사 필드 (`_startAt`, `_option` 등 프레임 내부 프로퍼티)

따라서 서브클래스에서 직접 선언한 필드만 설정 대상이 되며, 프레임워크 내부 구조는 노출되지 않습니다.
