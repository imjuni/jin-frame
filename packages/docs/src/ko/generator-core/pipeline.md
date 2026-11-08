---
outline: deep
---

# 생성 파이프라인

## 기본 흐름

```ts
import fs from "node:fs/promises";
import pathe from "node:path";
import {
  convertor,
  createFrames,
  createOpenapiTs,
  load,
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
const source = await createOpenapiTs(converted.document, {
  version: 3,
  int64AsString: true,
});

const specTypeFilePath = pathe.join(output, "paths.d.ts");
await fs.mkdir(output, { recursive: true });
await fs.writeFile(specTypeFilePath, source);

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
| `createOpenapiTs()` | `openapi-typescript`를 실행해 TypeScript 소스 문자열을 반환합니다. |
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



[패키지 문서 목록](../packages) · [시작하기](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)
