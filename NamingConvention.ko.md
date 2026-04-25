# JinFrame 네이밍 컨벤션

## 1. 제 1목표: 네임스페이스 충돌 방지

JinFrame을 사용하는 방법은 클래스를 상속하고, 그 위에 필드를 선언하는 것이다.

```typescript
class FindPetFrame extends JinFrame {
  @Query()
  declare public readonly status: string;

  @Query()
  declare public readonly create: string; // 'create'가 JinFrame의 메서드와 충돌!
}
```

사용자가 Kafka를 구독하는 로직의 설정을 변경하는 API를 만든다면 timeout, threshold, retry 등의 이름을 사용할 가능성이 있다. 비슷하게 공장에서 공정을 관리하는 경우도 마찬가지이다. 이런 경우 자주 사용되는 단어를 AbstractJinFrame과 JinFrame에서 사용하지 않아서 사용자가 편리하게 사용할 수 있다. 자연어를 변수로 선언할 때 최대한 충돌이 없어야 한다.

사용자가 선언하는 필드 이름이 `JinFrame` / `AbstractJinFrame`의 인스턴스 메서드 이름과 겹치면 예기치 못한 동작이 발생한다. 이를 방지하기 위해 **모든 인스턴스 메서드에 `_` 접두사를 붙인다.**

이 컨벤션은 v5.0 (axios 제거 포함 major 변경)에서 일괄 적용한다.

---

## 2. 네이밍 규칙

### 규칙 1: 핵심 내부 상태 — JavaScript Private Field (`#`)

- 클래스 외부는 물론 하위 클래스에서도 접근할 수 없는 진정한 private.
- 하위 클래스에서 필요한 값은 `AbstractJinFrame`에 `protected` getter로만 노출한다.

### 규칙 2: 모든 인스턴스 메서드 — `_` 접두사

- 사용자가 선언하는 field 이름과의 충돌을 원천 차단한다.
- 사용자용 API와 내부용 메서드를 구분하지 않는다. 인스턴스 메서드이면 모두 `_` 접두사를 붙인다.
- 오버라이드 가능한 hook 메서드도 동일하게 `_` 접두사를 붙인다.

### 규칙 3: 정적(static) 메서드 — 접두사 없음

- 정적 메서드는 인스턴스 필드와 충돌하지 않으므로 접두사를 붙이지 않는다.
- 호출 방식이 `MyFrame.builder()`, `MyFrame.of(...)` 이므로 사용자 필드와 분리된다.

---

## 3. 규칙 요약

| 패턴 | 대상 | 하위 클래스 접근 | 사용자 직접 호출 |
|------|------|-----------------|-----------------|
| `#xxx` | 핵심 내부 상태 | 불가 | 불가 |
| `_xxx` | 모든 인스턴스 메서드 및 hook | 가능 | 가능 |
| 없음 | 정적 메서드 | — | 가능 |
