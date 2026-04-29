---
outline: deep
---

# Authorization

**`jin-frame`** provides a decorator-based authentication system through `@Security` and `SecurityKey`.

> **Breaking changes in v5.0**
> - `@Authorization` decorator has been removed. Pass the security key as the second argument to `@Security` instead.
> - `OAuth2Provider` has been removed. Use `BearerTokenProvider` for Bearer token scenarios.

## Basic Usage

Pass the provider and key together to `@Security`:

```ts
import { Get, Security, JinFrame } from 'jin-frame';
import { BearerTokenProvider } from 'jin-frame/providers';

@Security(new BearerTokenProvider(), 'my-bearer-token')
@Get({
  host: 'https://api.example.com',
  path: '/user/{id}',
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

## Security Providers

### BearerTokenProvider

Adds an `Authorization: Bearer <token>` header. The `Bearer ` prefix is added automatically if not already present.

```ts
import { BearerTokenProvider } from 'jin-frame/providers';

@Security(new BearerTokenProvider(), 'user-token-12345')
@Get({ host: 'https://api.example.com', path: '/profile' })
export class ProfileFrame extends JinFrame {}
```

### ApiKeyProvider

Injects an API key into a header or query parameter.

```ts
import { ApiKeyProvider } from 'jin-frame/providers';

// API Key in header
@Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'), 'secret-api-key-value')
@Get({ host: 'https://api.example.com', path: '/data' })
export class DataFrame extends JinFrame {}

// API Key in query parameter
@Security(new ApiKeyProvider('api-key', 'apikey', 'query'), 'secret-api-key-value')
@Get({ host: 'https://api.example.com', path: '/public-data' })
export class PublicDataFrame extends JinFrame {}
```

### BasicAuthProvider

Encodes `username:password` as a Base64 `Authorization: Basic ...` header.

```ts
import { BasicAuthProvider } from 'jin-frame/providers';

@Security(new BasicAuthProvider(), { username: 'admin', password: 'secret123' })
@Get({ host: 'https://api.example.com', path: '/admin/users' })
export class AdminUserFrame extends JinFrame {}
```

## SecurityKey — Lazy / Async Key Resolution

The `SecurityKey` type is `string | (() => string | Promise<string>)`. This allows the token to be resolved at request time from environment variables, secret managers, or any async source.

```ts
// Static string
@Security(new BearerTokenProvider(), 'static-token')

// From environment variable (resolved at request time)
@Security(new BearerTokenProvider(), () => process.env.API_TOKEN ?? '')

// Async from a secret manager
@Security(new BearerTokenProvider(), async () => vault.getSecret('api-token'))
```

A full example using async key resolution:

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
})
@Security(new BearerTokenProvider(), async () => await vault.getSecret('api-token'))
class SecureFrame extends JinFrame<Response> {}
```

## BearerTokenProvider.setKey()

`setKey()` lets you update the Bearer token at runtime without reconstructing the provider. This is useful after a token refresh.

```ts
const bearerProvider = new BearerTokenProvider();

// Update token after refresh
bearerProvider.setKey(newAccessToken);

@Security(bearerProvider)
@Get({ host: 'https://api.example.com', path: '/profile' })
class ProfileFrame extends JinFrame {}
```

## Multiple Security Providers

You can attach multiple providers to a single frame. Each provider processes the key independently.

```ts
@Security([
  new BearerTokenProvider(),
  new ApiKeyProvider('client-id', 'X-Client-ID', 'header'),
], 'multi-auth-token')
@Get({ host: 'https://api.example.com', path: '/secure' })
export class MultiSecurityFrame extends JinFrame {}
```

## Class Inheritance and Override

A child class can override the parent's security configuration:

```ts
@Security(new BearerTokenProvider(), 'base-token')
@Get({ host: 'https://api.example.com' })
class BaseApiFrame extends JinFrame {}

@Security(new ApiKeyProvider('specialized-auth', 'X-API-Key', 'header'), 'specialized-api-key')
@Get({ path: '/specialized' })
class SpecializedApiFrame extends BaseApiFrame {}
```

## Environment-Specific Configuration

```ts
@Security(new BearerTokenProvider(), () => process.env.API_TOKEN ?? 'development-token')
@Get({
  host: process.env.API_HOST ?? 'https://dev-api.example.com',
  path: '/data',
})
export class DataFrame extends JinFrame {}
```

## Migration from v4.x

### Before (v4.x)

```ts
@Security(new BearerTokenProvider('my-auth'))
@Authorization('user-token-12345')
@Get({ host: 'https://api.example.com', path: '/user/{id}' })
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### After (v5.0)

```ts
@Security(new BearerTokenProvider(), 'user-token-12345')
@Get({ host: 'https://api.example.com', path: '/user/{id}' })
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### OAuth2Provider Migration

`OAuth2Provider` has been removed. Replace it with `BearerTokenProvider`:

```ts
// Before (v4.x)
@Security(new OAuth2Provider('oauth2', 'Bearer'))
@Authorization({ accessToken: 'oauth-access-token-xyz', tokenType: 'Bearer' })

// After (v5.0)
@Security(new BearerTokenProvider(), 'oauth-access-token-xyz')
```
