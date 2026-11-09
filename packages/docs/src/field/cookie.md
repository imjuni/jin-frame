---
outline: deep
---

# Cookies

`@Cookie()` serializes request fields into the Cookie header. This is useful for Node clients and controlled test environments; browser cookie and CORS policies still apply.

## Declaring cookie fields

```ts twoslash
import { Cookie, Get, JinFrame } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class SessionFrame extends JinFrame {
  // Use the server's cookie name instead of the local property name.
  @Cookie({ replaceAt: 'session_id' })
  declare readonly session: string;
}

// Inspect the generated Cookie header without sending the secret over a network.
const request = SessionFrame.of({ session: 'example-session' })._request();
console.log(request.headers);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAt` | `string` | Field name | Destination name instead of the field name. |
| `encode` | `boolean` | `false` | Apply URI encoding to the value. |
| `comma` | `boolean` | `false` | Join array elements with commas. |
| `bit.enable` | `boolean` | `false` | Combine numeric arrays using bitwise OR. |
| `bit.withZero` | `boolean` | `false` | Include a bitwise result even when it is zero. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | Transform values before serialization. |
| `cacheKeyExclude` | `boolean` | `false` | Exclude from dedupe identity without removing the transmitted value. |

Configure `bit` as `{ enable: true, withZero: false }`.

## Providers and browser behavior

`ApiKeyProvider(key, cookieName, 'cookie')` can also supply a Cookie header. Avoid combining competing cookie sources without inspecting the final headers: provider headers are merged after decorated cookies. Do not exclude a session identity from dedupe keys or log real session secrets.

Browsers normally manage cookies themselves and restrict setting the Cookie header directly. Use the browser's supported credentials/CORS flow where appropriate instead of assuming a Node header example bypasses those rules.
