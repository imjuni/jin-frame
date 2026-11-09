---
outline: deep
---

# What is jin-frame?

jin-frame은 TypeScript용 선언적 HTTP 클라이언트입니다. 메서드·URL·type가 있는 입력·인증·재시도·response 계약을 엔드포인트 class에 모읍니다. Axios가 아닌 네이티브 fetch로 실행합니다.

## Choose the right entry point

| 목적 | 문서 |
| --- | --- |
| 직접 request class 작성 | [시작하기](./getting-to-start) |
| Swagger/OpenAPI에서 클라이언트 생성 | [CLI](./generator-cli/) |
| 빌드·자체 도구에 생성기 통합 | [Generator core](./generator-core/) |
| 기존 클라이언트 업그레이드 | [v6 마이그레이션](./migration-v6) |

## Request lifecycle

1. `of()` 또는 `builder()`가 instance를 만들고 default value를 적용합니다.
2. `_execute()`가 비동기 인증값을 해석하고 URL·field·인증 컨텍스트를 구성합니다.
3. pre-hook 실행 후 조건에 맞는 중복 제거·시도별 타임아웃·재시도로 fetch를 감쌉니다.
4. response를 역직렬화하고 상태·body를 검증합니다.
5. 허용 response는 반환하며 거부 상태·처리 실패는 예외가 됩니다.

## Type safety and runtime safety

상태·body 유니온은 HTTP 상태와 body의 type 관계를 보존합니다. `validateStatus`는 호출에서 허용할 상태를 선택합니다. Zod 같은 Validator는 서버의 실제 값을 검사합니다. 서로 다른 책임이므로 TypeScript 선언이나 HTTP 코드 허용만으로 JSON이 검증되지는 않습니다.

## Organization

부모 프레임에 공통 호스트·header, field에 request 데이터, provider에 인증값을 둡니다. 훅으로 전송 로직을 흩뜨리지 않고 로그·측정을 추가합니다. 생성 클라이언트와 직접 작성한 프레임은 같은 런타임을 사용합니다.

가이드 예제는 레거시 TypeScript decorator와 공개 `jin-frame` 패키지를 사용합니다. Hover 예제는 사이트 빌드 중 type 검사합니다.
