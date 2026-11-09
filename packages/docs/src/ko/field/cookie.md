---
outline: deep
---

# Cookies

`@Cookie()`는 request field를 Cookie header로 직렬화합니다. Node 클라이언트와 통제된 테스트 환경에서 사용할 수 있으며 브라우저의 쿠키·CORS 정책은 그대로 적용됩니다.

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
| `replaceAt` | `string` | field 이름 | field 이름 대신 사용할 전송 이름입니다. |
| `encode` | `boolean` | `false` | 값에 URI 인코딩을 적용합니다. |
| `comma` | `boolean` | `false` | array 요소를 쉼표로 연결합니다. |
| `bit.enable` | `boolean` | `false` | 숫자 array를 비트 OR 값으로 합칩니다. |
| `bit.withZero` | `boolean` | `false` | 비트 OR 결과가 0이어도 포함합니다. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | 직렬화 전에 값을 변환합니다. |
| `cacheKeyExclude` | `boolean` | `false` | 전송 값은 유지하고 중복 제거 키에서만 제외합니다. |

`bit`는 `{ enable: true, withZero: false }` 형태로 지정합니다.

## Providers and browser behavior

`ApiKeyProvider(key, cookieName, 'cookie')`로도 Cookie header를 만들 수 있습니다. Provider header는 decorator 쿠키 뒤에 병합되므로 여러 쿠키 원본을 섞으면 최종 header를 확인합니다. 세션 식별자를 중복 제거 키에서 제외하거나 실제 비밀값을 로그에 남기지 않습니다.

브라우저는 보통 쿠키를 직접 관리하며 Cookie header 설정을 제한합니다. Node header 예제가 브라우저 정책을 우회한다고 가정하지 말고 브라우저의 credentials·CORS 흐름을 사용합니다.
