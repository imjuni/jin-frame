---
outline: deep
---

# URL Template (Path Parameter)

jin-frame는 path parameter에 **RFC 6570 URI Template** 문법을 사용합니다. 플레이스홀더는 `:variableName`이 아닌 `{variableName}` 형식으로 작성합니다.

> **스펙**: [RFC 6570 – URI Template](https://www.rfc-editor.org/rfc/rfc6570)  
> **구현체**: [url-template](https://www.npmjs.com/package/url-template) (npm)

---

## 문법

```
/path/{variable}
```

| 방식 | 예시 | 비고 |
|------|------|------|
| ✅ RFC 6570 (jin-frame) | `/users/{id}` | 올바른 방식 |
| ❌ Express 방식 | `/users/:id` | 지원하지 않음 |

---

## 기본 사용법

메서드 데코레이터의 `path`에 `{variable}` 형식으로 작성합니다. 각 플레이스홀더는 `@Param()` 데코레이터가 붙은 필드와 이름이 일치해야 합니다.

```ts
import { Get, Param, JinFrame } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{userId}/posts/{postId}',
})
class UserPostFrame extends JinFrame {
  @Param() declare readonly userId: string;
  @Param() declare readonly postId: number;
}

const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
// → GET https://api.example.com/users/alice/posts/42
```

---

## `host`와 `pathPrefix`에도 적용 가능

URI Template 확장은 `path`뿐만 아니라 `host`, `pathPrefix`에도 적용됩니다. 멀티 테넌트 또는 환경별 URL 분기에 유용합니다.

```ts
@Get({
  host: 'https://{tenant}.api.example.com',
  pathPrefix: '/v{version}',
  path: '/users/{id}',
})
class GetUserFrame extends JinFrame {
  @Param() declare readonly tenant: string;
  @Param() declare readonly version: string;
  @Param() declare readonly id: string;
}

const frame = GetUserFrame.of({ tenant: 'acme', version: '2', id: 'alice' });
// → GET https://acme.api.example.com/v2/users/alice
```

---

## 런타임 오버라이드

`host`, `pathPrefix`, `path`는 `_execute()` 호출 시 오버라이드할 수 있습니다. 오버라이드된 값에도 URI Template 확장이 적용됩니다.

```ts
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
  path: '/users/{id}',
});
```

---

## 필드명 매칭

플레이스홀더 이름은 클래스 필드명과 정확히 일치해야 합니다(대소문자 구분). 매칭되는 `@Param()` 필드가 없으면 플레이스홀더가 치환되지 않아 요청이 실패합니다.

```ts
@Get({ path: '/users/{id}' })
class Frame extends JinFrame {
  @Param() declare readonly id: string;   // ✅ {id}와 매칭
  // @Param() declare readonly Id: string; // ❌ {id} ≠ {Id}
}
```

---

## 참고 문서

- [RFC 6570 – URI Template](https://www.rfc-editor.org/rfc/rfc6570) — 전체 스펙
- [WHATWG URL Standard](https://url.spec.whatwg.org/) — URL 파싱 및 직렬화 규칙
- [@Param 데코레이터](../field/param.md) — 지원 타입 및 직렬화 옵션
