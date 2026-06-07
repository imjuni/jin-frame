# JinFrame Generator Core

----

## Background

JinFrame를 생성하기 위해 필요한 코어 라이브러리.

## Server

서버를 어떻게 적용할 것인지를 정리한다. OpenAPI 문서에서 host는 다음과 같이 결정된다.

1. API endpoint에서 Server 섹션이 있는 경우 사용한다
   1. Server 섹션에 host가 없는 경우 3번에서 얻은 host를 사용한다
2. Document Server 섹션이 있는 경우 사용한다
   1. Server 섹션에 host가 없는 경우 3번에서 얻은 host를 사용한다
3. OpenAPI 스펙을 얻은 endpoint에서 host를 사용한다

## Endpoint Overrides

`generator-core`는 OpenAPI `paths`의 key를 기준으로 endpoint별 옵션을 적용한다. CLI는 문자열 인자와 설정 파일을 파싱해서 object로 넘기고, 실제 생성 정책은 core에서 처리한다.

```ts
await createFrames({
  document,
  specTypeFilePath: "./generated/paths.d.ts",
  output: "./generated",
  useCodeFence: false,
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

override key는 OpenAPI 문서의 path key와 동일해야 한다. 예를 들어 OpenAPI 문서가 `"/pets/{petId}"`를 사용하면 override도 `"/pets/{petId}"`를 사용한다.

적용 규칙은 다음과 같다.

- `timeouts[path]`: endpoint frame에 `@Timeout(...)`을 생성한다.
- `retries[path]`: endpoint frame에 `@Retry(...)`을 생성한다.
- `hosts[path]`: endpoint method decorator에 `host`를 직접 생성한다.

base frame을 사용하는 경우에도 endpoint별 host override는 개별 endpoint decorator에 직접 기록한다. 이렇게 해야 공통 base host보다 endpoint override가 우선 적용된다.
