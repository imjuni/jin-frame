# @jin-frame/generator-cli

[통합 문서](https://imjuni.github.io/jin-frame/ko/generator-cli/)


1.0.0 버전은 `jin-frame` 6.x를 대상으로 합니다.


OpenAPI 문서에서 `jin-frame` 요청 클래스를 생성하는 CLI 패키지입니다.

CLI 실행 이름은 `frame-cli`입니다.

## 패키지 형식

`@jin-frame/generator-cli`는 실행 파일 전용 패키지입니다. ESM 실행 파일 `frame-cli`를 제공하며 라이브러리 API나 TypeScript 타입 선언은 제공하지 않습니다.

```text
dist/
└── cli.mjs
```

## 요구사항

- Node.js 22.23.4 이상(22.x)
- TypeScript 6 이상

## 설치

```sh
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0
```

## create

OpenAPI 문서에서 `paths.d.ts`와 frame 파일을 함께 생성합니다.

```sh
frame-cli create ./openapi.yml --output ./generated
```

생성 결과는 보통 다음과 같습니다.

```text
generated/
├── paths.d.ts
├── ServerHostFrame.ts
├── securities/
│   └── ApiKeySecurityProvider.ts
└── pet/
    ├── AddPetFrame.ts
    └── GetPetByIdFrame.ts
```

Swagger/OpenAPI v2 문서도 입력으로 사용할 수 있습니다. 내부에서 OpenAPI v3로 변환한 뒤 생성합니다.
OpenAPI 3.0과 3.1 문서를 지원하며, 3.1 문서는 원래 스키마를 유지한 채 타입을 생성합니다.
문서에 지원하는 security scheme이 있으면 `securities` 디렉터리도 생성합니다.

Query 배열 직렬화는 `form`, `spaceDelimited`, `pipeDelimited`를 지원합니다. `deepObject`와 path의
`matrix`, `label`처럼 현재 `jin-frame`으로 정확히 표현할 수 없는 형식은 생성 중 오류로 알립니다.

## frame

이미 생성된 `openapi-typescript` 타입 정의가 있다면 frame 파일만 생성할 수 있습니다.

```sh
frame-cli frame ./openapi.yml \
  --type ./generated/paths.d.ts \
  --output ./generated
```

## 주요 옵션

| 옵션 | 설명 |
|---|---|
| `--output`, `-o` | 생성 파일을 쓸 디렉터리입니다. |
| `--type`, `-t` | `frame` 명령에서 사용할 `paths.d.ts` 경로입니다. |
| `--config` | 설정 파일 경로입니다. |
| `--host`, `-H` | 기본 host 또는 endpoint별 host override입니다. |
| `--timeout` | 기본 timeout 또는 endpoint별 timeout override입니다. |
| `--retry` | endpoint별 retry override입니다. |
| `--base-frame` | 생성할 base frame 클래스 이름입니다. |
| `--int64-as-string` | OpenAPI `integer` + `int64`/`i64` 타입을 TypeScript `string`으로 생성합니다. |
| `--host-strategy` | Host 생성 전략입니다: `string`, `function`, `env-function`. |
| `--host-env-var` | `env-function`이 사용할 환경 변수입니다. 기본값은 `NODE_ENV`입니다. |
| `--host-function-name` | `function` 전략이 생성 코드에 사용할 함수 식별자입니다. |
| `--host-function-import` | `function` 전략의 resolver를 가져올 모듈 경로입니다. |
| `--server-mapping` | 환경과 server URL의 매핑을 나타내는 JSON 객체입니다. |
| `--security-provider-dir` | 생성할 security provider 클래스의 디렉터리입니다. |

## 설정 파일

여러 옵션을 미리 설정 파일로 저장할 수 있습니다. 현재 작업 디렉터리에서 `frame-cli.config.*`를 찾습니다. `--config`로 직접 지정할 수도 있습니다.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --config ./frame-cli.config.ts
```

예시:

```ts
export default {
  host: "https://api.example.com",
  timeout: 60_000,
  baseFrame: "ServerHostFrame",
  int64AsString: true,
};
```

## Endpoint override

특정 endpoint에만 host, timeout, retry를 적용할 수 있습니다.

```sh
frame-cli create ./openapi.yml \
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

## Host 전략

기본 `string` 전략은 해석한 server URL을 생성된 frame에 문자열로 기록합니다.

애플리케이션에서 정의한 host resolver를 참조하려면 `function` 전략을 사용합니다.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy function \
  --host-function-name getApiHost \
  --host-function-import ./apiHost.js
```

환경 변수에 따라 host를 선택하는 inline resolver를 생성하려면 `env-function` 전략을 사용합니다.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --host-strategy env-function \
  --host-env-var API_ENV \
  --server-mapping '{"development":"https://dev.api.example.com","production":"https://api.example.com"}'
```

상대 경로 형태의 OpenAPI server URL은 가능한 경우 path prefix로 처리합니다.

생성 파일은 전체 결과의 경로와 충돌을 검증한 뒤 임시 위치에서 준비하여 반영합니다. 이전 실행의 manifest에
기록된 파일 중 더 이상 생성되지 않는 파일은 정리하며, 사용자가 직접 만든 파일은 삭제하지 않습니다.

## Security provider

OpenAPI `apiKey`, HTTP Bearer, HTTP Basic security scheme에 대응하는 provider subclass를 생성합니다. Root-level 및 operation-level security requirement는 생성된 frame decorator에 반영됩니다.

기본 생성 디렉터리는 `securities`입니다. `--security-provider-dir`로 변경할 수 있습니다.

사용자 정의 provider는 설정 파일에서 매핑할 수 있습니다. 각 key는 OpenAPI 문서의 security scheme 이름과 일치해야 합니다.

```ts
export default {
  securityProviderDir: "auth",
  securityProviders: {
    oauth2: {
      className: "AppOAuthProvider",
      importPath: "../auth/AppOAuthProvider.js",
    },
  },
};
```

## OpenAPI TypeScript 옵션

`create` 명령은 `openapi-typescript` 옵션 일부를 `oat-*` prefix로 전달할 수 있습니다.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --oat-alphabetize \
  --oat-export-type
```

세부 옵션은 `frame-cli create --help`에서 확인할 수 있습니다.

## License

[MIT](LICENSE)

## 명세 URL과 API 서버 URL

명세에 `servers`가 없거나 비어 있으면 원격 명세 URL의 origin만 API host로 사용합니다. 예를 들어 `http://localhost:7878/swagger/json`에서 읽은 명세의 `/health` 요청은 `http://localhost:7878/health`입니다. 명세 문서의 경로·query·fragment는 API 접두사로 사용하지 않습니다. 명시한 `host` 또는 `servers[].url`의 경로는 보존하며, 상대 server URL은 명세 URL을 기준으로 해석합니다. 로컬 파일에 server 정보가 없다면 host를 명시해야 합니다.
