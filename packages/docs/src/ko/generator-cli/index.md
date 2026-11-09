---
outline: deep
---

# @jin-frame/generator-cli

## Introduction

OpenAPI 문서에서 `jin-frame` request class와 TypeScript type를 생성하는 CLI입니다. 실행 명령은 `frame-cli`입니다.

1.0.0 버전은 `jin-frame` 6.x를 대상으로 합니다.

## Why generator-cli?

- **OpenAPI 명세에서 request 코드를 생성합니다.** `create` 명령으로 type 정의와 프레임을 함께 생성합니다.
- **기존 type 정의를 사용할 수 있습니다.** `frame` 명령으로 이미 생성한 type 정의를 참조하는 프레임을 생성합니다.
- **프로젝트별 생성 설정을 저장합니다.** 설정 파일로 출력 경로와 request option을 지정하고, 사용자 정의 템플릿으로 생성 코드를 조정합니다.

## Package Format

`@jin-frame/generator-cli`는 실행 파일 전용 패키지입니다. ESM 실행 파일 `frame-cli`를 제공하며 라이브러리 API나 TypeScript type 선언은 제공하지 않습니다.

```text
dist/
└── cli.mjs
```


## Requirements

- Node.js 22.23.4 이상(22.x)
- TypeScript 6 이상


## Installation

```sh
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0
```



[패키지 문서 목록](../packages) · [시작하기](./index) · [명령어](./commands) · [Configuration](./configuration)
