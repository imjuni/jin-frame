---
outline: deep
---

# Authorization

Jin-Frame supports various authentication methods and introduces a powerful new decorator-based authentication system for more robust and flexible authentication configuration.

## 🆕 New Decorator-Based Authentication System (Recommended)

Starting from v4.7.0, the new **`@Security`** and **`@Authorization`** decorators provide clearer and type-safe authentication configuration.

### 1. Security Providers System

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

// API Key in header
@Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'))
@Authorization('secret-api-key-value')
@Get({
  host: 'https://api.example.com',
  path: '/data',
})
export class DataFrame extends JinFrame {}

// API Key in query parameter
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

### 2. Multiple Security Provider Support

You can support multiple authentication methods for a single API endpoint:

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

### 3. Dynamic Authentication Data

You can pass authentication information dynamically at runtime:

```ts
const frame = UserProfileFrame.of({ id: '123' });

// Pass dynamic authentication token
const response = await frame.execute({
  dynamicAuth: 'dynamic-runtime-token'
});
```

### 4. Complex Authorization Data

Complex authentication data structures are also supported:

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

## Legacy Inline Method

> ⚠️ **Warning**: The legacy method uses a typo in the `authoriztion` field and will be removed in v5.0.0. For new projects, the decorator approach is recommended.

### 1. Bearer Token (deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/me',
  authoriztion: 'Bearer mytoken123',  // typo: authoriztion
})
export class MeFrame extends JinFrame {}
```

### 2. Basic Auth (deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
  authoriztion: { username: 'alice', password: 'secret' },  // typo: authoriztion
})
export class SecureFrame extends JinFrame {}
```

## Migration Guide

Learn how to migrate from the legacy `authoriztion` field (with typo) to the new decorator-based approach.

### Before (Legacy - deprecated)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/user/:id',
  authoriztion: 'Bearer user-token-12345',  // typo field
})
export class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;
}
```

### After (New Approach - recommended)

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

### Step-by-Step Migration Guide

1. **Add Imports**: Import Security and Authorization decorators and Provider classes

   ```ts
   import { Security, Authorization } from 'jin-frame';
   import { BearerTokenProvider } from 'jin-frame/providers';
   ```

2. **Configure Security Provider**: Choose and configure the appropriate Provider

   ```ts
   // For Bearer Token
   @Security(new BearerTokenProvider('auth-name'))

   // For API Key
   @Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'))

   // For Basic Auth
   @Security(new BasicAuthProvider('basic-auth'))
   ```

3. **Move Authorization Data**: Move `authoriztion` field value to `@Authorization` decorator

   ```ts
   // Legacy
   authoriztion: 'Bearer token123'

   // New approach
   @Authorization('token123')  // Bearer is handled by Provider
   ```

4. **Remove deprecated field**: Completely remove the `authoriztion` field from options

### Complex Migration Examples

#### Legacy (Multiple Authentication Methods)

```ts
// Multiple classes with different auth methods
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

#### New Approach (Unified Pattern)

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

## Advanced Features

### 1. Class Inheritance and Authentication Override

```ts
@Security(new BearerTokenProvider('base-auth'))
@Authorization('base-token')
@Get({ host: 'https://api.example.com' })
class BaseApiFrame extends JinFrame {}

// Child class overrides authentication method
@Security(new ApiKeyProvider('specialized-auth', 'X-API-Key', 'header'))
@Authorization('specialized-api-key')
@Get({ path: '/specialized' })
class SpecializedApiFrame extends BaseApiFrame {}
```

### 2. Dynamic Authentication Data

Pass authentication information dynamically at runtime:

```ts
const frame = UserProfileFrame.of({ id: '123' });

// Use dynamic value instead of static Authorization decorator value
const response = await frame.execute({
  dynamicAuth: 'runtime-generated-token'
});
```

### 3. Multiple Security Providers

Support multiple authentication methods for a single API:

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

## Compatibility and Priority

When new decorator-based and legacy methods coexist, the priority order is:

1. **Dynamic Authentication** (`execute({ dynamicAuth: '...' })`)
2. **Directly passed authentication headers**
3. **New Security Provider System**
4. **Legacy `authoriztion` field** (deprecated)

```ts
// When all methods are mixed
@Security(new BearerTokenProvider('new-auth'))    // Priority 3
@Authorization('decorator-token')
@Get({
  host: 'https://api.example.com',
  path: '/mixed',
  authoriztion: 'Bearer legacy-token',             // Priority 4 (lowest)
})
class MixedAuthFrame extends JinFrame {}

const frame = MixedAuthFrame.of();
const response = await frame.execute({
  dynamicAuth: 'runtime-token'                     // Priority 1 (highest)
});
```

## Troubleshooting

### Common Migration Errors

1. **"Provider name is required" error**

   ```ts
   // ❌ Incorrect
   @Security(new BearerTokenProvider())

   // ✅ Correct
   @Security(new BearerTokenProvider('my-auth-provider'))
   ```

2. **Mixing legacy typo field with new approach**

   ```ts
   // ❌ Not recommended: mixing new and legacy approaches
   @Security(new BearerTokenProvider('new-auth'))
   @Get({
     host: 'https://api.example.com',
     authoriztion: 'Bearer old-token',  // Recommend removing
   })

   // ✅ Use only new approach
   @Security(new BearerTokenProvider('new-auth'))
   @Authorization('new-token')
   @Get({
     host: 'https://api.example.com',
   })
   ```

3. **Type mismatch errors**

   ```ts
   // ❌ Authorization data type mismatch
   @Security(new BasicAuthProvider('basic'))
   @Authorization('Bearer token')  // BasicAuth requires an object

   // ✅ Use correct type
   @Security(new BasicAuthProvider('basic'))
   @Authorization({ username: 'user', password: 'pass' })
   ```

## Best Practices

### 1. Provider Naming Conventions

```ts
// ✅ Good: Clear and specific names
@Security(new BearerTokenProvider('user-auth'))
@Security(new ApiKeyProvider('client-api-key', 'X-Client-ID', 'header'))

// ❌ Bad: Vague names
@Security(new BearerTokenProvider('auth'))
@Security(new ApiKeyProvider('key', 'X-Key', 'header'))
```

### 2. Structured Authorization Data

```ts
// ✅ Good: Structured data
@Authorization({
  type: 'oauth2',
  accessToken: 'token123',
  refreshToken: 'refresh456',
  scope: ['read', 'write']
})

// ✅ Good: Simple token
@Authorization('Bearer simple-token')
```

### 3. Environment-Specific Configuration

```ts
// Configuration using environment variables
@Security(new BearerTokenProvider('api-auth'))
@Authorization(process.env.API_TOKEN || 'development-token')
@Get({
  host: process.env.API_HOST || 'https://dev-api.example.com',
  path: '/data'
})
export class DataFrame extends JinFrame {}
```
