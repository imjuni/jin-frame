# @jin-frame/generator-cli

OpenAPI 문서에서 `jin-frame` 요청 클래스를 생성하는 CLI 패키지입니다.

CLI 실행 이름은 `frame-cli`입니다.

## 설치

```sh
pnpm add -D @jin-frame/generator-cli
pnpm add jin-frame
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
└── pet/
    ├── AddPetFrame.ts
    └── GetPetByIdFrame.ts
```

Swagger/OpenAPI v2 문서도 입력으로 사용할 수 있습니다. 내부에서 OpenAPI v3로 변환한 뒤 생성합니다.

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

MIT
