---
outline: deep
---

# 네이밍 컨벤션

## 목표: 네임스페이스 충돌 방지

jin-frame은 클래스를 상속하고, 그 위에 필드를 선언하는 방식으로 사용합니다:

```typescript
class FindPetFrame extends JinFrame {
  @Query()
  declare public readonly status: string;

  @Query()
  declare public readonly create: string; // 'create'가 JinFrame의 메서드와 충돌할 수 있습니다!
}
```

실제 API에서는 `timeout`, `retry`, `status`, `create`, `request` 같은 이름을 필드로 선언하는 것이 매우 자연스럽습니다. 만약 이런 이름이 `JinFrame`의 인스턴스 메서드와 겹치면, 조용히 잘못 동작하는 버그가 발생합니다.

이 문제를 근본적으로 차단하기 위해, jin-frame은 모든 내부 식별자에 일관된 접두사 전략을 적용합니다.

---

## 규칙

### 규칙 1 — 핵심 내부 상태: JavaScript Private Field (`#`)

프레임의 내부 상태를 담는 필드는 [JavaScript private field](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields)(`#field`)로 선언합니다.

- 클래스 외부는 물론 하위 클래스에서도 완전히 접근 불가합니다.
- 하위 클래스에서 필요한 값은 `AbstractJinFrame`에 `protected` getter로만 노출합니다.

### 규칙 2 — 모든 인스턴스 메서드: `_` 접두사

공개 API든 내부 헬퍼든, 오버라이드 가능한 훅이든 — **모든 인스턴스 메서드**에 `_` 접두사를 붙입니다.

- 사용자가 선언한 필드 이름이 프레임워크 메서드와 충돌할 가능성을 완전히 제거합니다.
- "공개 API"와 "내부용"을 구분하지 않습니다. 인스턴스 메서드이면 무조건 `_`를 붙입니다.
- 훅 메서드도 동일한 규칙을 따릅니다: `_preHook`, `_postHook`, `_retryFail`, `_retryException`.

### 규칙 3 — 정적(static) 메서드: 접두사 없음

정적 메서드는 클래스 자체에서 호출(`MyFrame.of(...)`, `MyFrame.builder()`)하므로 인스턴스 필드와 충돌하지 않습니다. 접두사를 붙이지 않습니다.

---

## 요약

| 패턴 | 대상 | 하위 클래스 접근 | 사용자 직접 호출 |
| ---- | ---- | --------------- | --------------- |
| `#xxx` | 핵심 내부 상태 | 불가 | 불가 |
| `_xxx` | 모든 인스턴스 메서드 및 훅 | 가능 | 가능 |
| (없음) | 정적 메서드 | — | 가능 |

```typescript
class MyFrame extends JinFrame<Result> {
  // 사용자 정의 필드 — 어떤 이름이든 접두사 불필요
  @Query()
  declare public readonly retry: number; // 안전 — 내부 retry 상태와 충돌 없음

  @Query()
  declare public readonly timeout: string; // 안전 — 내부 #timeout과 충돌 없음

  // 훅 오버라이드 — 컨벤션에 따라 _ 접두사 필수
  protected override _preHook(req: JinRequestConfig): void {
    console.log(req.url);
  }
}

// 정적 팩토리 — 접두사 없음
const frame = MyFrame.of({ retry: 3, timeout: '5s' });

// 인스턴스 메서드 호출 — _ 접두사
await frame._execute();
```
