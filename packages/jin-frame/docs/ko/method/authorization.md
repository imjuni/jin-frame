---
outline: deep
---

# Authorization

**`jin-frame`**은 `@Security`와 `SecurityKey`를 통해 데코레이터 기반 인증 시스템을 제공합니다.

> **v5.0 주요 변경사항**
> - `@Authorization` 데코레이터가 제거되었습니다. 대신 `@Security`의 두 번째 인자로 키를 전달합니다.
> - `OAuth2Provider`가 제거되었습니다. Bearer 토큰 시나리오에는 `BearerTokenProvider`를 사용하세요.

## 기본 사용법

`@Security`에 프로바이더와 키를 함께 전달합니다:

```ts
import { Get, Security, JinFrame } from 'jin-frame';
import { BearerTokenProvider } from 'jin-frame/providers';

@Security(new BearerTokenProvider(), 'my-bearer-token')
@Get({
  host: 'https://api.example.com',
  path: '/user/:id',
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

## Security Providers

### BearerTokenProvider

`Authorization: Bearer <token>` 헤더를 추가합니다. `Bearer ` 접두사가 없으면 자동으로 붙여줍니다.

```ts
import { BearerTokenProvider } from 'jin-frame/providers';

@Security(new BearerTokenProvider(), 'user-token-12345')
@Get({ host: 'https://api.example.com', path: '/profile' })
export class ProfileFrame extends JinFrame {}
```

### ApiKeyProvider

API 키를 헤더 또는 쿼리 파라미터에 주입합니다.

```ts
import { ApiKeyProvider } from 'jin-frame/providers';

// 헤더에 API Key 설정
@Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'), 'secret-api-key-value')
@Get({ host: 'https://api.example.com', path: '/data' })
export class DataFrame extends JinFrame {}

// 쿼리 파라미터에 API Key 설정
@Security(new ApiKeyProvider('api-key', 'apikey', 'query'), 'secret-api-key-value')
@Get({ host: 'https://api.example.com', path: '/public-data' })
export class PublicDataFrame extends JinFrame {}
```

### BasicAuthProvider

`username:password`를 Base64로 인코딩하여 `Authorization: Basic ...` 헤더로 전송합니다.

```ts
import { BasicAuthProvider } from 'jin-frame/providers';

@Security(new BasicAuthProvider(), { username: 'admin', password: 'secret123' })
@Get({ host: 'https://api.example.com', path: '/admin/users' })
export class AdminUserFrame extends JinFrame {}
```

## SecurityKey — 지연/비동기 키 해석

`SecurityKey` 타입은 `string | (() => string | Promise<string>)`입니다. 이를 통해 환경 변수, 시크릿 매니저 등 다양한 소스에서 요청 시점에 토큰을 가져올 수 있습니다.

```ts
// 정적 문자열
@Security(new BearerTokenProvider(), 'static-token')

// 환경 변수에서 (요청 시점에 해석)
@Security(new BearerTokenProvider(), () => process.env.API_TOKEN ?? '')

// 시크릿 매니저에서 비동기로 가져오기
@Security(new BearerTokenProvider(), async () => vault.getSecret('api-token'))
```

비동기 키 해석 전체 예제:

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
})
@Security(new BearerTokenProvider(), async () => await vault.getSecret('api-token'))
class SecureFrame extends JinFrame<Response> {}
```

## BearerTokenProvider.setKey()

`setKey()`를 사용하면 프로바이더 인스턴스를 재생성하지 않고 런타임에 Bearer 토큰을 업데이트할 수 있습니다. 토큰 갱신 후 사용하기에 적합합니다.

```ts
const bearerProvider = new BearerTokenProvider();

// 토큰 갱신 후 업데이트
bearerProvider.setKey(newAccessToken);

@Security(bearerProvider)
@Get({ host: 'https://api.example.com', path: '/profile' })
class ProfileFrame extends JinFrame {}
```

## 다중 Security Provider

하나의 프레임에 여러 프로바이더를 붙일 수 있습니다. 각 프로바이더는 독립적으로 키를 처리합니다.

```ts
@Security([
  new BearerTokenProvider(),
  new ApiKeyProvider('client-id', 'X-Client-ID', 'header'),
], 'multi-auth-token')
@Get({ host: 'https://api.example.com', path: '/secure' })
export class MultiSecurityFrame extends JinFrame {}
```

## 클래스 상속과 인증 재정의

자식 클래스에서 부모의 인증 설정을 재정의할 수 있습니다:

```ts
@Security(new BearerTokenProvider(), 'base-token')
@Get({ host: 'https://api.example.com' })
class BaseApiFrame extends JinFrame {}

@Security(new ApiKeyProvider('specialized-auth', 'X-API-Key', 'header'), 'specialized-api-key')
@Get({ path: '/specialized' })
class SpecializedApiFrame extends BaseApiFrame {}
```

## 환경별 설정

```ts
@Security(new BearerTokenProvider(), () => process.env.API_TOKEN ?? 'development-token')
@Get({
  host: process.env.API_HOST ?? 'https://dev-api.example.com',
  path: '/data',
})
export class DataFrame extends JinFrame {}
```

## v4.x에서 마이그레이션

### Before (v4.x)

```ts
@Security(new BearerTokenProvider('my-auth'))
@Authorization('user-token-12345')
@Get({ host: 'https://api.example.com', path: '/user/:id' })
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### After (v5.0)

```ts
@Security(new BearerTokenProvider(), 'user-token-12345')
@Get({ host: 'https://api.example.com', path: '/user/:id' })
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### OAuth2Provider 마이그레이션

`OAuth2Provider`가 제거되었습니다. `BearerTokenProvider`로 대체하세요:

```ts
// Before (v4.x)
@Security(new OAuth2Provider('oauth2', 'Bearer'))
@Authorization({ accessToken: 'oauth-access-token-xyz', tokenType: 'Bearer' })

// After (v5.0)
@Security(new BearerTokenProvider(), 'oauth-access-token-xyz')
```
