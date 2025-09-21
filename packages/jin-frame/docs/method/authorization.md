---
outline: deep
---

# Authorization

Instead of manually defining an `Authorization` header using `@Header()`,  
you can now use the **`authorization` option** to configure authentication more conveniently.

## 1. Bearer Token

```ts
@Get({
  host: 'https://api.example.com',
  path: '/me',
  authorization: 'Bearer mytoken123',
})
export class MeFrame extends JinFrame {}
```

This automatically sets the request header:

```text
Authorization: Bearer mytoken123
```

## 2. Basic Auth (Axios `auth` option)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/secure',
  authorization: { username: 'alice', password: 'secret' },
})
export class SecureFrame extends JinFrame {}
```

This uses the native Axios `auth` field:

```text
Authorization: Basic YWxpY2U6c2VjcmV0
```
