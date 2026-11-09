---
outline: deep
---

# Configuration

## Config File

| option | 설명 |
|---|---|
| `--output`, `-o` | 생성 파일을 쓸 디렉터리입니다. |
| `--type`, `-t` | `frame` 명령에서 사용할 `paths.d.ts` 경로입니다. |
| `--config` | 설정 파일 경로입니다. |
| `--host`, `-H` | 기본 host 또는 endpoint별 host override입니다. |
| `--timeout` | 기본 timeout 또는 endpoint별 timeout override입니다. |
| `--retry` | endpoint별 retry override입니다. |
| `--base-frame` | 생성할 base frame class 이름입니다. |
| `--int64-as-string` | OpenAPI `integer` + `int64`/`i64` type를 TypeScript `string`으로 생성합니다. |
| `--host-strategy` | Host 생성 전략입니다: `string`, `function`, `env-function`. |
| `--host-env-var` | `env-function`이 사용할 환경 변수입니다. default value는 `NODE_ENV`입니다. |
| `--host-function-name` | `function` 전략이 생성 코드에 사용할 function 식별자입니다. |
| `--host-function-import` | `function` 전략의 resolver를 가져올 모듈 경로입니다. |
| `--server-mapping` | 환경과 server URL의 매핑을 나타내는 JSON object입니다. |
| `--security-provider-dir` | 생성할 security provider class의 디렉터리입니다. |


## Main Options

여러 option을 미리 설정 파일로 저장할 수 있습니다. 현재 작업 디렉터리에서 `frame-cli.config.*`를 찾습니다. `--config`로 직접 지정할 수도 있습니다.

```sh
pnpm exec frame-cli create ./openapi.yml \
  --output ./generated \
  --config ./frame-cli.config.ts
```

예시:

```ts
export default {
  // Default API host; endpoint overrides can replace it.
  host: "https://api.example.com",
  timeout: 60_000,
  baseFrame: "ServerHostFrame",
  int64AsString: true,
};
```


## Endpoint Override

특정 endpoint에만 host, timeout, retry를 적용할 수 있습니다.

```sh
pnpm exec frame-cli create ./openapi.yml \
  --output ./generated \
  --timeout "/pets/{petId}=3000" \
  --host "/pets/{petId}=https://pet-api.example.com" \
  --retry '/pets/{petId}={"max":3,"interval":500}'
```

설정 파일에서도 같은 값을 지정할 수 있습니다.

```ts
export default {
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
};
```

override key는 OpenAPI 문서의 path key와 동일해야 합니다.


## Host Strategy

기본 `string` 전략은 해석한 server URL을 생성된 frame에 string으로 기록합니다.

애플리케이션에서 정의한 host resolver를 참조하려면 `function` 전략을 사용합니다.

```sh
pnpm exec frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy function \
  --host-function-name getApiHost \
  --host-function-import ./apiHost.js
```

환경 변수에 따라 host를 선택하는 inline resolver를 생성하려면 `env-function` 전략을 사용합니다.

```sh
pnpm exec frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy env-function \
  --host-env-var API_ENV \
  --server-mapping '{"development":"https://dev.api.example.com","production":"https://api.example.com"}'
```

상대 경로 형태의 OpenAPI server URL은 가능한 경우 path prefix로 처리합니다.

생성 파일은 전체 결과의 경로와 충돌을 검증한 뒤 임시 위치에서 준비하여 반영합니다. 이전 실행의 manifest에
기록된 파일 중 더 이상 생성되지 않는 파일은 정리하며, 사용자가 직접 만든 파일은 삭제하지 않습니다.


## Security Providers

OpenAPI `apiKey`, HTTP Bearer, HTTP Basic security scheme에 대응하는 provider subclass를 생성합니다. Root-level 및 operation-level security requirement는 생성된 frame decorator에 반영됩니다.

기본 생성 디렉터리는 `securities`입니다. `--security-provider-dir`로 변경할 수 있습니다.

사용자 정의 provider는 설정 파일에서 매핑할 수 있습니다. 각 key는 OpenAPI 문서의 security scheme 이름과 일치해야 합니다.

```ts
export default {
  securityProviderDir: "auth",
  // Map OpenAPI scheme names to application-owned provider classes.
  securityProviders: {
    oauth2: {
      className: "AppOAuthProvider",
      importPath: "../auth/AppOAuthProvider.js",
    },
  },
};
```



[패키지 문서 목록](../packages) · [시작하기](./index) · [명령어](./commands) · [Configuration](./configuration)

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
