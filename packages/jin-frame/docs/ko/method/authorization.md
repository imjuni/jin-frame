---
outline: deep
---

# Authorization

이제 `@Header()`를 사용하여 수동으로 `Authorization` 헤더를 정의하지 않고, 더 간편하게 인증을 설정할 수 있는 **`authorization` 옵션**을 사용할 수 있습니다.

## 1. Bearer 토큰 방식

```ts
@Get({
  host: 'https://api.example.com',
  path: '/me',
  authorization: 'Bearer mytoken123',
})
export class MeFrame extends JinFrame {}
```

자동으로 다음과 같은 요청 헤더가 설정됩니다:

```text
Authorization: Bearer mytoken123
```

## 2. Basic 인증 (Axios `auth` 옵션 활용)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
  authorization: { username: 'alice', password: 'secret' },
})
export class SecureFrame extends JinFrame {}
```

Axios의 기본 `auth` 필드를 활용하여 다음과 같이 헤더가 설정됩니다:

```text
Authorization: Basic YWxpY2U6c2VjcmV0
```
