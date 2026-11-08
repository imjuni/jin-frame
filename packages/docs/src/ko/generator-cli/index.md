---
outline: deep
---

# @jin-frame/generator-cli

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



[패키지 문서 목록](../packages) · [시작하기](./index) · [명령어](./commands) · [Configuration](./configuration)
