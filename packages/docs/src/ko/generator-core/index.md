---
outline: deep
---

# @jin-frame/generator-core

## Introduction

OpenAPI 문서에서 `jin-frame` 요청 클래스와 TypeScript 타입을 생성하는 라이브러리입니다. `@jin-frame/generator-cli`도 이 패키지를 사용합니다.

1.0.0 버전은 `jin-frame` 6.x를 대상으로 합니다.

## Why generator-core?

- **기존 도구에 코드 생성을 연결합니다.** TypeScript나 JavaScript 코드에서 생성 API를 직접 호출합니다.
- **생성 파이프라인을 구성합니다.** 명세 로딩, 검증, 변환, 타입 생성, 프레임 생성 단계를 필요한 흐름으로 연결합니다.
- **생성 결과와 진행 상황을 제어합니다.** 옵션과 사용자 정의 템플릿으로 출력을 조정하고, 이벤트 관찰자로 진행 상황과 진단 정보를 받습니다.

## 패키지 형식

`@jin-frame/generator-core`는 ESM-only 패키지입니다. ESM `import`를 사용하며 CommonJS `require()`는 지원하지 않습니다.

배포 패키지는 ESM runtime bundle과 TypeScript 타입 선언을 포함합니다.

```text
dist/
├── esm/index.mjs
└── types/index.d.ts
```


## 요구사항

- Node.js 22.23.4 이상(22.x)
- TypeScript 6 이상


## 설치

```sh
pnpm add -D @jin-frame/generator-core@^1.0.0 openapi-typescript typescript@^6
pnpm add jin-frame@^6.0.0
```

`@jin-frame/generator-core`는 생성 시점에 사용하고, `jin-frame`은 생성된 frame을 실행할 때 필요합니다.



[패키지 문서 목록](../packages) · [시작하기](./index) · [생성 파이프라인](./pipeline) · [Configuration](./configuration)

## API 레퍼런스

공개 함수·인터페이스·타입은 소스에서 TypeDoc으로 생성합니다. [generator-core API](/api/generator-core/)
