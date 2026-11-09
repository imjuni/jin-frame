---
outline: deep
---

# Authorization

Security provider는 인증값을 header·query·쿠키로 변환합니다. `authorization`만으로 header를 만들지 않습니다. constructor 첫 인자는 provider 이름이 아니라 키 또는 동기 키 반환 function입니다.

## Bearer tokens

request를 구성할 때 function에서 현재 값을 읽습니다. string `dynamicAuth`가 있으면 function을 평가하지 않습니다. constructor에 비동기 function은 전달하지 않습니다.

```ts twoslash
import { BearerTokenProvider, Get, JinFrame } from 'jin-frame';

// Replace this value when your application refreshes its token.
let accessToken = 'initial-token';
const bearer = new BearerTokenProvider(() => accessToken);

@Get({
  host: 'https://api.example.com',
  path: '/me',
  security: bearer,
})
class ProfileFrame extends JinFrame {}

// Inspect the generated header without sending a request.
const frame = ProfileFrame.of();
console.log(frame._request().headers);

// Override only this execution; the shared provider is unchanged.
const reply = await frame._execute({ dynamicAuth: 'per-request-token' });
```

## API keys and Basic credentials

```ts twoslash
import { ApiKeyProvider, BasicAuthProvider, BearerTokenProvider } from 'jin-frame';

// Choose a header, query parameter, or cookie destination.
const headerKey = new ApiKeyProvider('secret', 'X-API-Key');
const queryKey = new ApiKeyProvider(() => 'current-key', 'api_key', 'query');
const cookieKey = new ApiKeyProvider('session-value', 'session', 'cookie');

// Basic consumes encoded user:password; Bearer adds the scheme prefix.
const basic = new BasicAuthProvider(() => btoa('user:password'));
const bearer = new BearerTokenProvider('access-token');

// The common provider can send a complete Authorization value too.
const custom = new ApiKeyProvider(() => 'Bearer access-token', 'Authorization');
```

Basic과 Bearer는 `ApiKeyProvider`를 상속하며 접두사가 없을 때만 인증 스킴을 붙입니다. `setKey(string또는function)`는 이후 request가 공유하는 키 원본을 바꿉니다.

## Priority and composition

명시적인 `Authorization` header가 있으면 provider를 사용하지 않습니다. 다음은 호출 option의 Basic `auth`입니다. 나머지는 string `dynamicAuth`, provider 자체 키, decorator의 `authorization` 순으로 선택합니다. Basic은 기존 `{ username, password }` 인증값도 지원합니다.

array의 provider를 순서대로 처리하고 header·query를 병합합니다. 같은 키는 뒤의 값이 우선합니다. 서로 다른 인증값은 각 constructor에 전달합니다. 공통 `dynamicAuth`는 이름으로 구분하지 않고 모든 provider에 전달합니다. 이름은 메타데이터이며 Basic·Bearer의 두 번째 인자, API 키의 네 번째 인자입니다.

## Async credentials

```ts twoslash
import { BearerTokenProvider, Get, JinFrame, Security } from 'jin-frame';

/** Replace with an asynchronous secret manager call. */
async function loadToken(): Promise<string> {
  return 'resolved-token';
}

// _execute() resolves the supplier before constructing the request.
@Security(new BearerTokenProvider(), loadToken)
@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class AsyncProfileFrame extends JinFrame {}

const reply = await AsyncProfileFrame.of()._execute();
```

동기 메서드 `_request()`는 비동기 인증값을 해석하지 않으므로 이 경우 `_execute()`를 사용합니다. provider는 빈 string을 거부하지 않습니다. 누락된 키 검사는 애플리케이션에서 수행하며 로그의 인증값도 자동 마스킹하지 않습니다.
