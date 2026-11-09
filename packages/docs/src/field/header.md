---
outline: deep
---

# Headers

`@Header()` maps fields to outgoing HTTP headers. Use `replaceAt` to specify the header name.

## Example

```ts twoslash
import { Get, JinFrame, Header } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class ExampleFrame extends JinFrame {
  // Map a convenient field name to its HTTP header name.
  @Header({ replaceAt: 'X-Request-Id' })
  declare readonly requestId: string;

  @Header({ replaceAt: 'Accept-Language' })
  declare readonly language?: string;
}

// Build the request without contacting the placeholder server.
const frame = ExampleFrame.of({ requestId: 'request-123', language: 'en' });
const request = frame._request();
console.log(request.headers);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAt` | `string` | Field name | Destination name instead of the field name. |
| `encode` | `boolean` | `true` | Apply URI encoding to the value. |
| `comma` | `boolean` | `false` | Join array elements with commas. |
| `bit.enable` | `boolean` | `false` | Combine numeric arrays using bitwise OR. |
| `bit.withZero` | `boolean` | `false` | Include a bitwise result even when it is zero. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | Transform values before serialization. |
| `cacheKeyExclude` | `boolean` | `false` | Exclude from dedupe identity without removing the transmitted value. |

Configure `bit` as `{ enable: true, withZero: false }`.

## Header names and values

`replaceAt` chooses the wire name; the field remains a typed factory input. Optional absent fields are omitted. `comma`, `bit`, and `formatters` are available for API-specific serialization, but an HTTP header is not a nested JSON object.

## Authentication and browser restrictions

An explicit `Authorization` header bypasses security providers. Avoid unintentionally overriding constructor token suppliers with a decorated header. Browsers can restrict headers such as Cookie and User-Agent; CORS and browser rules still apply.

Do not set multipart Content-Type manually: native FormData supplies its boundary. `cacheKeyExclude` should not hide user identity in a request that may share results across callers.
