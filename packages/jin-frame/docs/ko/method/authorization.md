---
outline: deep
---

# Authorization

Jin-Frame은 다양한 인증 방식을 지원하며, 새로운 데코레이터 기반 인증 시스템을 통해 더욱 강력하고 유연한 인증 설정이 가능합니다.

## 🆕 새로운 데코레이터 기반 인증 시스템 (권장)

v4.7.0부터 도입된 새로운 **`@Security`**와 **`@Authorization`** 데코레이터를 사용하면 더욱 명확하고 타입 안전한 인증 설정이 가능합니다.

### 1. Security Providers 시스템

#### Bearer Token Provider

```ts
import { Get, Security, Authorization, JinFrame } from 'jin-frame';
import { BearerTokenProvider } from 'jin-frame/providers';

@Security(new BearerTokenProvider('my-auth'))
@Authorization('user-token-12345')
@Get({
  host: 'https://api.example.com',
  path: '/user/:id',
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

#### API Key Provider

```ts
import { ApiKeyProvider } from 'jin-frame/providers';

// 헤더에 API Key 설정
@Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'))
@Authorization('secret-api-key-value')
@Get({
  host: 'https://api.example.com',
  path: '/data',
})
export class DataFrame extends JinFrame {}

// 쿼리 파라미터에 API Key 설정
@Security(new ApiKeyProvider('api-key', 'apikey', 'query'))
@Authorization('secret-api-key-value')
@Get({
  host: 'https://api.example.com',
  path: '/public-data',
})
export class PublicDataFrame extends JinFrame {}
```

#### Basic Authentication Provider

```ts
import { BasicAuthProvider } from 'jin-frame/providers';

@Security(new BasicAuthProvider('basic-auth'))
@Authorization({ username: 'admin', password: 'secret123' })
@Get({
  host: 'https://api.example.com',
  path: '/admin/users',
})
export class AdminUserFrame extends JinFrame {}
```

#### OAuth2 Provider

```ts
import { OAuth2Provider } from 'jin-frame/providers';

@Security(new OAuth2Provider('oauth2', 'Bearer'))
@Authorization({
  accessToken: 'oauth-access-token-xyz',
  tokenType: 'Bearer'
})
@Get({
  host: 'https://api.example.com',
  path: '/oauth/profile',
})
export class OAuthProfileFrame extends JinFrame {}
```

### 2. 다중 Security Provider 지원

하나의 API 엔드포인트에서 여러 인증 방식을 동시에 지원할 수 있습니다:

```ts
@Security([
  new BearerTokenProvider('bearer-auth'),
  new ApiKeyProvider('client-id', 'X-Client-ID', 'header')
])
@Authorization('multi-auth-token')
@Get({
  host: 'https://api.example.com',
  path: '/secure',
})
export class MultiSecurityFrame extends JinFrame {}
```

### 3. 동적 인증 데이터

런타임에 인증 정보를 동적으로 전달할 수 있습니다:

```ts
const frame = UserProfileFrame.of({ id: '123' });

// 동적 인증 토큰 전달
const response = await frame.execute({
  dynamicAuth: 'dynamic-runtime-token'
});
```

### 4. 복합 Authorization 데이터

복잡한 인증 데이터 구조도 지원합니다:

```ts
@Authorization({
  oauth: {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
    tokenType: 'Bearer',
    expiresIn: 3600,
  },
  apiKeys: ['key1', 'key2', 'key3'],
  metadata: {
    userId: 'user123',
    scopes: ['read', 'write', 'admin'],
  },
})
```

## 기존 인라인 방식 (레거시)

> ⚠️ **주의**: 기존 방식은 `authoriztion` 필드의 오타가 있으며, v5.0.0에서 제거될 예정입니다. 새로운 프로젝트에서는 데코레이터 방식 사용을 권장합니다.

### 1. Bearer 토큰 방식 (deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/me',
  authoriztion: 'Bearer mytoken123',  // 오타: authoriztion
})
export class MeFrame extends JinFrame {}
```

### 2. Basic 인증 (deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
  authoriztion: { username: 'alice', password: 'secret' },  // 오타: authoriztion
})
export class SecureFrame extends JinFrame {}
```

## 마이그레이션 가이드

기존 오타가 있는 `authoriztion` 필드에서 새로운 데코레이터 방식으로 마이그레이션하는 방법을 안내합니다.

### Before (기존 방식 - deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/user/:id',
  authoriztion: 'Bearer user-token-12345',  // 오타 필드
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### After (새로운 방식 - 권장)

```ts
@Security(new BearerTokenProvider('my-auth'))
@Authorization('user-token-12345')
@Get({
  host: 'https://api.example.com',
  path: '/user/:id',
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### 마이그레이션 단계별 가이드

1. **Import 추가**: Security와 Authorization 데코레이터, Provider 클래스들을 import

   ```ts
   import { Security, Authorization } from 'jin-frame';
   import { BearerTokenProvider } from 'jin-frame/providers';
   ```

2. **Security Provider 설정**: 적절한 Provider 선택 및 설정

   ```ts
   // Bearer Token의 경우
   @Security(new BearerTokenProvider('auth-name'))

   // API Key의 경우
   @Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'))

   // Basic Auth의 경우
   @Security(new BasicAuthProvider('basic-auth'))
   ```

3. **Authorization 데이터 이동**: `authoriztion` 필드 값을 `@Authorization` 데코레이터로 이동

   ```ts
   // 기존
   authoriztion: 'Bearer token123'

   // 새로운 방식
   @Authorization('token123')  // Bearer는 Provider에서 처리
   ```

4. **deprecated 필드 제거**: `authoriztion` 필드를 옵션에서 완전히 제거

### 복잡한 마이그레이션 예제

#### 기존 방식 (여러 인증 방식)

```ts
// 여러 클래스에 각각 다른 인증 방식
@Get({
  host: 'https://api.example.com',
  path: '/bearer-auth',
  authoriztion: 'Bearer token123',
})
class BearerFrame extends JinFrame {}

@Get({
  host: 'https://api.example.com',
  path: '/basic-auth',
  authoriztion: { username: 'user', password: 'pass' },
})
class BasicFrame extends JinFrame {}
```

#### 새로운 방식 (통일된 패턴)

```ts
@Security(new BearerTokenProvider('bearer-auth'))
@Authorization('token123')
@Get({
  host: 'https://api.example.com',
  path: '/bearer-auth',
})
class BearerFrame extends JinFrame {}

@Security(new BasicAuthProvider('basic-auth'))
@Authorization({ username: 'user', password: 'pass' })
@Get({
  host: 'https://api.example.com',
  path: '/basic-auth',
})
class BasicFrame extends JinFrame {}
```

## 고급 기능

### 1. 클래스 상속과 인증 재정의

```ts
@Security(new BearerTokenProvider('base-auth'))
@Authorization('base-token')
@Get({ host: 'https://api.example.com' })
class BaseApiFrame extends JinFrame {}

// 자식 클래스에서 인증 방식 재정의
@Security(new ApiKeyProvider('specialized-auth', 'X-API-Key', 'header'))
@Authorization('specialized-api-key')
@Get({ path: '/specialized' })
class SpecializedApiFrame extends BaseApiFrame {}
```

### 2. 동적 인증 데이터

런타임에 인증 정보를 동적으로 전달:

```ts
const frame = UserProfileFrame.of({ id: '123' });

// 정적 Authorization 데코레이터 값 대신 동적 값 사용
const response = await frame.execute({
  dynamicAuth: 'runtime-generated-token'
});
```

### 3. 다중 Security Provider

하나의 API에서 여러 인증 방식 지원:

```ts
@Security([
  new BearerTokenProvider('primary-auth'),
  new ApiKeyProvider('fallback-auth', 'X-Fallback-Key', 'header')
])
@Authorization('primary-token')
@Get({
  host: 'https://api.example.com',
  path: '/multi-auth',
})
export class MultiAuthFrame extends JinFrame {}
```

## 호환성 및 우선순위

새로운 데코레이터 방식과 기존 방식이 혼재할 때의 우선순위:

1. **동적 인증** (`execute({ dynamicAuth: '...' })`)
2. **직접 전달된 인증 헤더**
3. **새로운 Security Provider 시스템**
4. **레거시 `authoriztion` 필드** (deprecated)

```ts
// 모든 방식이 혼재된 경우
@Security(new BearerTokenProvider('new-auth'))    // 우선순위 3
@Authorization('decorator-token')
@Get({
  host: 'https://api.example.com',
  path: '/mixed',
  authoriztion: 'Bearer legacy-token',             // 우선순위 4 (가장 낮음)
})
class MixedAuthFrame extends JinFrame {}

const frame = MixedAuthFrame.of();
const response = await frame.execute({
  dynamicAuth: 'runtime-token'                     // 우선순위 1 (가장 높음)
});
```

## 문제 해결

### 일반적인 마이그레이션 오류

1. **"Provider name is required" 오류**

   ```ts
   // ❌ 잘못된 예
   @Security(new BearerTokenProvider())

   // ✅ 올바른 예
   @Security(new BearerTokenProvider('my-auth-provider'))
   ```

2. **기존 오타 필드 혼용**

   ```ts
   // ❌ 새로운 방식과 기존 방식 혼용 (권장하지 않음)
   @Security(new BearerTokenProvider('new-auth'))
   @Get({
     host: 'https://api.example.com',
     authoriztion: 'Bearer old-token',  // 제거 권장
   })

   // ✅ 새로운 방식만 사용
   @Security(new BearerTokenProvider('new-auth'))
   @Authorization('new-token')
   @Get({
     host: 'https://api.example.com',
   })
   ```

3. **타입 불일치 오류**

   ```ts
   // ❌ Authorization 데이터 타입 불일치
   @Security(new BasicAuthProvider('basic'))
   @Authorization('Bearer token')  // BasicAuth에는 객체가 필요

   // ✅ 올바른 타입 사용
   @Security(new BasicAuthProvider('basic'))
   @Authorization({ username: 'user', password: 'pass' })
   ```
