---
outline: deep
---

# Headers

`@Header()`는 field를 HTTP header에 연결합니다. `replaceAt`으로 전송할 header 이름을 지정합니다.

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
| `replaceAt` | `string` | field 이름 | field 이름 대신 사용할 전송 이름입니다. |
| `encode` | `boolean` | `true` | 값에 URI 인코딩을 적용합니다. |
| `comma` | `boolean` | `false` | array 요소를 쉼표로 연결합니다. |
| `bit.enable` | `boolean` | `false` | 숫자 array를 비트 OR 값으로 합칩니다. |
| `bit.withZero` | `boolean` | `false` | 비트 OR 결과가 0이어도 포함합니다. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | 직렬화 전에 값을 변환합니다. |
| `cacheKeyExclude` | `boolean` | `false` | 전송 값은 유지하고 중복 제거 키에서만 제외합니다. |

`bit`는 `{ enable: true, withZero: false }` 형태로 지정합니다.

## Header names and values

`replaceAt`은 전송 이름을 고르고 field는 type가 있는 Factory 입력으로 유지됩니다. 값 없는 선택 field는 생략합니다. API 계약에 맞춰 `comma`, `bit`, `formatters`를 쓸 수 있지만 header는 중첩 JSON object가 아닙니다.

## Authentication and browser restrictions

명시적인 `Authorization` header가 있으면 security provider를 사용하지 않습니다. constructor 토큰 function을 header field로 덮어쓰지 않도록 확인합니다. 브라우저는 Cookie·User-Agent 같은 header를 제한할 수 있으며 CORS 규칙도 적용됩니다.

multipart Content-Type은 직접 넣지 않습니다. FormData가 boundary를 생성합니다. `cacheKeyExclude`로 사용자 식별 정보를 제외하면 서로 다른 호출자가 response를 공유할 수 있으므로 주의합니다.
