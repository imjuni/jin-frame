# @jin-frame/generator-core

OpenAPI 문서에서 `jin-frame` 요청 클래스를 생성하기 위한 core 패키지입니다.

`@jin-frame/generator-cli`는 이 패키지를 사용해 CLI 입력과 설정 파일을 처리합니다. 직접 생성 파이프라인을 구성하거나 별도 도구에 붙이고 싶다면 `generator-core`를 사용합니다.

## 요구사항

- Node.js 22 이상
- TypeScript 6 이상

## 설치

```sh
pnpm add -D @jin-frame/generator-core openapi-typescript ts-morph typescript
pnpm add jin-frame
```

`@jin-frame/generator-core`는 생성 시점에 사용하고, `jin-frame`은 생성된 frame을 실행할 때 필요합니다.

## 기본 흐름

```ts
import fs from "node:fs/promises";
import pathe from "pathe";
import {
  convertor,
  createFrames,
  createOpenapiTs,
  load,
  renderOpenapiTs,
  safePathJoin,
  validate,
} from "@jin-frame/generator-core";

const specPath = "./openapi.yml";
const output = "./generated";

const loaded = await load(specPath);
if (loaded == null) {
  throw new Error(`Failed to load spec from ${specPath}`);
}

const validated = validate(loaded.data);
if (!validated.valid) {
  throw new Error("Invalid OpenAPI document");
}

const converted = await convertor(validated);
const nodes = await createOpenapiTs(converted.document, {
  version: 3,
  int64AsString: true,
});

const specTypeFilePath = pathe.join(output, "paths.d.ts");
await fs.mkdir(output, { recursive: true });
await fs.writeFile(specTypeFilePath, renderOpenapiTs(nodes));

const frames = await createFrames({
  document: converted.document,
  specTypeFilePath,
  specFilePath: specPath,
  output,
  useCodeFence: false,
  baseFrame: "ServerHostFrame",
});

for (const frame of frames) {
  const dirPath = safePathJoin(output, frame.frame.tag);
  const filePath = pathe.join(dirPath, frame.frame.filePath);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, frame.frame.source);
}
```

## 주요 API

| API | 설명 |
|---|---|
| `load()` | 로컬 파일 또는 URL에서 OpenAPI 문서를 읽습니다. JSON/YAML을 지원합니다. |
| `validate()` | OpenAPI v2/v3 문서인지 검증합니다. |
| `convertor()` | Swagger/OpenAPI v2 문서를 OpenAPI v3 문서로 변환합니다. |
| `createOpenapiTs()` | `openapi-typescript`를 실행해 TypeScript AST를 생성합니다. |
| `renderOpenapiTs()` | 생성된 AST를 TypeScript source로 출력합니다. |
| `createFrames()` | OpenAPI v3 문서와 타입 정의 경로를 바탕으로 frame source를 생성합니다. |

## 생성 결과

기본적으로 operation의 첫 번째 tag를 디렉터리 이름으로 사용합니다.

```text
generated/
├── paths.d.ts
├── ServerHostFrame.ts
├── securities/
│   └── ApiKeySecurityProvider.ts
├── pet/
│   ├── AddPetFrame.ts
│   └── GetPetByIdFrame.ts
└── store/
    └── GetInventoryFrame.ts
```

tag가 없는 operation은 `output` 바로 아래에 생성됩니다.
문서에 지원하는 security scheme이 있으면 security provider 파일도 생성합니다.

## 자주 쓰는 옵션

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  specFilePath: "./openapi.yml",
  output: "./generated",
  useCodeFence: false,
  baseFrame: "ServerHostFrame",
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

`overrides`의 key는 OpenAPI 문서의 path key와 동일해야 합니다. 예를 들어 OpenAPI path가 `"/pets/{petId}"`라면 override도 같은 문자열을 사용합니다.

## Host 전략

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

## Security provider

OpenAPI `apiKey`, HTTP Bearer, HTTP Basic security scheme에 대응하는 provider subclass를 생성합니다. Root-level 및 operation-level security requirement는 생성된 frame decorator에 반영됩니다.

`securityProviderDir`로 기본 `securities` 디렉터리를 변경할 수 있습니다. 특정 scheme에 생성 provider 대신 애플리케이션 provider를 연결하려면 `securityProviders`를 사용합니다.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  securityProviderDir: "auth",
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
const nodes = await createOpenapiTs(document, {
  version: 3,
  int64AsString: true,
});
```

이 옵션은 OpenAPI `type: integer`, `format: int64` 또는 `format: i64` 스키마를 TypeScript `string`으로 생성합니다.

## License

[MIT](LICENSE)
