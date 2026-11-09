---
outline: deep
---

# Configuration

## Common Options

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  specFilePath: "./openapi.yml",
  output: "./generated",
  useCodeFence: false,
  baseFrame: "ServerHostFrame",
  // Default API host; endpoint overrides can replace it.
  host: "https://api.example.com",
  timeout: 60_000,
  overrides: {
    timeouts: {
      "/pets/{petId}": 3_000,
    },
    hosts: {
      "/pets/{petId}": "https://pet-api.example.com",
    },
    retries: {
      "/pets/{petId}": {
        max: 3,
        interval: 500,
      },
    },
  },
});
```

`overrides`의 key는 OpenAPI 문서의 path key와 동일해야 합니다. 예를 들어 OpenAPI path가 `"/pets/{petId}"`라면 override도 같은 string을 사용합니다.


## Host Strategies

`createFrames()`는 세 가지 host 전략을 지원합니다.

- `string`: 해석한 server URL을 생성 코드에 직접 기록합니다.
- `function`: `hostFunctionName`으로 지정한 식별자를 기록합니다. 생성 코드의 scope에서 resolver를 사용할 수 있어야 합니다.
- `env-function`: `hostEnvVar`와 `serverMapping`을 사용하는 inline resolver를 생성합니다.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  hostStrategy: "env-function",
  hostEnvVar: "API_ENV",
  serverMapping: {
    development: "https://dev.api.example.com",
    production: "https://api.example.com",
  },
});
```

상대 경로 형태의 OpenAPI server URL은 가능한 경우 path prefix로 처리합니다.


## Security Providers

OpenAPI `apiKey`, HTTP Bearer, HTTP Basic security scheme에 대응하는 provider subclass를 생성합니다. Root-level 및 operation-level security requirement는 생성된 frame decorator에 반영됩니다.

`securityProviderDir`로 기본 `securities` 디렉터리를 변경할 수 있습니다. 특정 scheme에 생성 provider 대신 애플리케이션 provider를 연결하려면 `securityProviders`를 사용합니다.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  securityProviderDir: "auth",
  // Map OpenAPI scheme names to application-owned provider classes.
  securityProviders: {
    oauth2: {
      className: "AppOAuthProvider",
      importPath: "../auth/AppOAuthProvider.js",
    },
  },
});
```

`securityProviders`의 각 key는 OpenAPI 문서의 security scheme 이름과 일치해야 합니다.


## int64

JavaScript에서 64-bit integer를 안전하게 다루기 어렵다면 `int64AsString`을 사용할 수 있습니다.

```ts
const source = await createOpenapiTs(document, {
  version: 3,
  int64AsString: true,
});
```

이 option은 OpenAPI `type: integer`, `format: int64` 또는 `format: i64` schema를 TypeScript `string`으로 생성합니다.



[패키지 문서 목록](../packages) · [시작하기](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)

## Specification URL fallback

`servers`가 없거나 비어 있고 host도 지정하지 않았다면 원격 명세 URL의 origin만 사용합니다. `/swagger/json`은 명세를 읽는 경로이며 API 경로가 아닙니다. 예를 들어 `http://localhost:7878/swagger/json`의 `/health`는 `http://localhost:7878/health`로 request합니다. 명시한 host·server URL의 경로와 상대 server URL 해석은 유지합니다. 로컬 명세 파일에는 서버 정보나 명시적 host가 필요합니다.

## Generated provider constructors

생성된 provider는 선택적인 키 string 또는 동기 키 반환 function을 받습니다. 첫 인자로 이름을 전달하던 템플릿은 갱신해야 합니다. 키를 전달하지 않으면 기존 decorator 인증값을 사용합니다.

```ts
import { BearerTokenProvider } from 'jin-frame';

// Generated subclasses preserve the OpenAPI scheme name as metadata.
export class BearerAuthProvider extends BearerTokenProvider {
  constructor(key?: ConstructorParameters<typeof BearerTokenProvider>[0]) {
    super(key, 'bearerAuth');
  }
}

// Resolve the current key whenever a request is built.
const provider = new BearerAuthProvider(() => process.env.API_TOKEN ?? '');
```
