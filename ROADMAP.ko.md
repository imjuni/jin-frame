# 로드맵

## 현재 진행 상황

미완료 최상위 항목은 13개입니다. 구현·테스트·편의 기능 10개(jin-frame 6, CLI 1, core 3)와 가능성 검토 3개로 나뉩니다.

체크 표시는 현재 저장소의 구현·테스트에 근거하며 배포 완료를 의미하지 않습니다. 생성 결과 컴파일 검증과 런타임 host·인증 변경은 완료로 갱신했습니다. 캐시 관련 중복 항목은 하나로 합쳤습니다.

6.0의 상태별 응답 union·호출별 상태 추론·전체 응답 검증기와 세 패키지 통합 문서는 완료됐습니다. 아래 미완료 기능을 전부 6.0 출시 조건으로 간주하지 않습니다. 출시 전 검증으로 우선할 항목은 로컬 tarball CLI 스모크와 schema composition 스모크입니다. content-type 판별, 캐시, 프로그레스 등은 후속 기능입니다.

## jin-frame

- [ ] 내장 Mocking (현재 MSW 연동 문서·테스트는 제공하지만 라이브러리 자체 mock 등록 API는 없음)
  - 배열로 Mocking을 등록할 수 있다
  - 각 배열은 { url: string; params: self, reply: unknown } 형식으로 등록된다
    - params는 타입을 의미한다. 캐시가 매칭되는지 확인할 때 자신의 멤버 변수를 전달하면 그 값도 매칭한다
  - execute를 하거나 request를 실행했을 때 배열을 순회하면서 응답을 반환한다
- [ ] BigInt 타입(Long 타입) 직렬화 기능 추가
- [ ] endpoint·query 기반 메모리/LRU 응답 캐시
  - cache timeout을 계산해서 timeout이 지나면 또 실행, 그게 아니면 return
  - 캐시 관련 전략을 알아보자 swr처럼 stale-while-revalidate 을 할 수 있을까?
  - 캐시 관련 header도 알아보자
- [ ] 파일 업로드 등의 테스트를 할 수 있게 fastify로 간단한 서버를 작성해보자
- [ ] 업/다운로드 프로그레스 이벤트
- [x] 요청 시점의 host·인증 설정 변경
  - `_execute()` / `_create()`의 런타임 URL 옵션과 요청별 인증 설정을 제공한다. Next.js 전용 통합 테스트 완료를 의미하지 않는다.
- [ ] 상태 코드와 content-type별 응답 모델 지원
  - OpenAPI 응답은 `status-code + content-type -> response schema` 형태로 정의된다.
  - OpenAPI 계약 정보를 잃지 않으면서 상태 코드와 content-type별로 성공/실패 DTO를 구분해서 지원한다.
  - 상태 코드별 union과 기본 2xx 추론은 완료했다. content-type별 타입 판별은 미완료다. 현재 생성기는 같은 상태의 여러 media type을 data union으로 합친다.

### 가능성 검토

- [ ] 강력한 캐시 계층 (IndexedDB/AsyncStorage)
- [ ] 인증 템플릿 (플러그인처럼 끼우기, 가능성 검진 필요함, node + browser 둘 다 가능한지, 그러기 위해서 어떻게 해야 하는지 검토 필요)
- [ ] 전송 어댑터 다중화 (Edge/Node/Deno/React Native에서 native fetch 기반 인터페이스와 환경별 구현 주입 가능성 검토)
  - fetch 어댑터 인터페이스를 고정하고, 환경별 구현 주입:
  - Node: undici
  - Edge/Cloudflare: Web Fetch
  - RN: cross-fetch or whatwg-fetch polyfill
  - Deno: native fetch

### 완료

- [x] 배열 괄호처리 1 fruit[]=apple&fruit[]=banana
- [x] 배열 괄호처리 2 fruit[1]=apple&fruit[2]=banana
- [x] Retry-After 헤더 처리
- [x] 전체 응답 기반 검증기
  - 단일 `validator`와 `BaseValidator<Replies, TError>`를 사용한다. `getData()`는 전체 응답을 반환하고 `validator()`에서 status별 스키마를 선택한다.
  - zod, json-schema(ajv), etc ...
- [x] 요청 디듀플/버스팅 방지
  - 동일 주소, 동일 조건으로 빠르게 수차례 요청한 경우 한 번에 응답

## generator-cli

- [ ] server 숫자가 여러 개 일 경우 숫자만큼 BaseFrame 생성
  - BaseFrame 사용하지 않을 경우 올바르게 host, path 추가

### 완료

- [x] Authorization 설정에 따라 jin-frame 생성
  - OpenAPI `securitySchemes`를 기반으로 custom security provider subclass를 생성한다.
  - root-level과 operation-level security requirement를 생성된 frame에 적용한다.
  - security scheme별 provider class name과 import path override를 지원한다.

## generator-core

### 테스트

- [ ] 로컬 패키징 CLI 스모크 테스트
  - `@jin-frame/generator-core` 런타임 번들이 준비된 뒤, 로컬 Swagger/OpenAPI fixture로 전체 `frame-cli create` 파이프라인을 검증한다.
  - 대상 흐름: `load -> validate -> convertor -> createOpenapiTs -> createFrames -> write files`.
  - 외부 공개 API나 원격 Swagger 문서에 의존하지 않는다.
- [x] 생성 결과 컴파일 확인 (상태별 응답 union 통합 테스트)
  - `responseUnion.integration.test.ts`에서 임시 생성 결과와 소비자 코드를 TypeScript compiler API의 noEmit 검사로 확인한다.
  - 실제 배포 tarball 설치 검증이나 모든 생성 옵션의 컴파일 검증까지 완료했다는 뜻은 아니다.
- [ ] Schema composition 스모크 커버리지
  - `allOf`, `oneOf`, `anyOf`를 사용하는 request/response schema에서도 frame 생성이 실패하지 않는지 확인한다.
  - 타입 확장의 정확성은 `openapi-typescript`에 위임한다.
  - 절대 URL과 상대 URL이 섞인 multi-server spec.
  - `servers` 필드가 없는 spec.

### 선택적 편의 기능

- [ ] Barrel file 생성
  - 그룹 import를 위해 각 tag 디렉터리에 `index.ts`를 선택적으로 생성한다.
  - 생성된 client는 직접 frame 파일을 import하는 방식으로도 계속 사용할 수 있다.

### 완료

- [x] 상대 server URL 동작 문서화
  - `hostStrategy: "string"`에서 상대 server URL은 가능한 경우 path prefix로 처리된다.
  - generator CLI와 core 패키지 README에 동작을 명시했다.
- [x] OpenAPI `integer` + `format: int64` string mapping
  - `--int64-as-string`은 OpenAPI `integer` schema 중 `format: int64` / `i64`를 `string`으로 매핑한다.
  - 이 매핑은 `openapi-typescript` schema transform을 통해 적용되므로, 중첩된 `ObjectBody` 필드도 생성된 `paths.d.ts` 타입에 반영된다.
- [x] Swagger/OpenAPI v2 변환
  - Swagger v2 문서는 검증 후 `convertor()`를 통해 OpenAPI v3로 변환된다.
- [x] `specTypeFilePath`와 `specFilePath` 분리
  - `specTypeFilePath`는 생성된 타입 import에 사용된다.
  - `specFilePath`는 별도로 입력받아 원본 spec URL/host 해석에 사용된다.
- [x] 깔끔한 의존성 방향
  - `generator-core`는 `generator-cli` option type을 참조하지 않는다.
  - CLI는 자체 option을 파싱하고 plain core option을 `createFrames()`에 전달한다.
- [x] OpenAPI TypeScript 렌더링
  - `createOpenapiTs()`는 `openapi-typescript`의 렌더러로 생성한 TypeScript 소스 문자열을 반환한다.
- [x] Endpoint override 생성
  - `timeouts[path]`, `retries[path]`, `hosts[path]`를 `createFrames()`에서 입력받는다.
  - CLI는 반복 override 인자와 `frame-cli.config.*`를 같은 object shape으로 파싱한다.
- [x] URL spec loading에 native fetch 사용
  - `generator-core`는 더 이상 원격 OpenAPI 문서를 로딩하기 위해 `axios`에 의존하지 않는다.
