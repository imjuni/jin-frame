---
outline: deep
---

# 명령어

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


## OpenAPI TypeScript 옵션

`create` 명령은 `openapi-typescript` 옵션 일부를 `oat-*` prefix로 전달할 수 있습니다.

```sh
frame-cli create ./openapi.yml \
  --output ./generated \
  --oat-alphabetize \
  --oat-export-type
```

세부 옵션은 `frame-cli create --help`에서 확인할 수 있습니다.



[패키지 문서 목록](../packages) · [시작하기](./index) · [명령어](./commands) · [Configuration](./configuration)
