---
outline: deep
---

# HTTP Methods

`@Get()`, `@Post()` 같은 decorator로 class의 HTTP 메서드와 URL을 지정합니다. `@Param()`, `@Query()`, `@Body()`는 그 request에 전달할 값을 정의합니다.

## Method decorators

| decorator | HTTP 메서드 | 용도 |
| --- | --- | --- |
| `@Get()` | `GET` | 리소스 조회 |
| `@Post()` | `POST` | 리소스 생성·작업 request |
| `@Put()` | `PUT` | 리소스 교체 |
| `@Patch()` | `PATCH` | 리소스 일부 수정 |
| `@Delete()` | `DELETE` | 리소스 삭제 |
| `@Head()` | `HEAD` | body 없이 response header 조회 |
| `@Options()` | `OPTIONS` | 엔드포인트 통신 option 조회 |
| `@Search()` | `SEARCH` | API가 정의한 검색 메서드 |
| `@Purge()` | `PURGE` | API가 정의한 캐시 삭제 메서드 |
| `@Link()` | `LINK` | API가 정의한 리소스 연결 메서드 |
| `@Unlink()` | `UNLINK` | API가 정의한 리소스 연결 해제 메서드 |
| `@Trace()` | `TRACE` | TRACE 선언. 네이티브 fetch는 이 메서드를 거부함 |

표의 메서드 이름은 라이브러리가 제공하는 decorator입니다. 실제 전송 가능 여부는 fetch와 서버의 지원에 따릅니다.

## Common options

default value는 부모 설정이 없는 경우를 기준으로 합니다.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | `string \| (() => string)` | `undefined` | protocol을 포함하는 API 호스트. URL placeholder 사용 가능. |
| `pathPrefix` | `string \| (() => string)` | `undefined` | path 앞에 붙는 공통 경로. |
| `path` | `string \| (() => string)` | `undefined` | URL placeholder를 포함할 수 있는 엔드포인트 경로. |
| `contentType` | `string` | `'application/json'` | body 직렬화 형식. |
| `timeout` | `number` | `120000` | 각 HTTP 시도의 타임아웃(ms). |
| `retry` | `FrameRetry` | `undefined` | 시도 한도·재시도 간격. 미설정 시 한 번 시도. |
| `security` | `SecurityProvider \| SecurityProvider[]` | `undefined` | 인증 컨텍스트를 만드는 provider. |
| `authorization` | `AuthorizationData` | `undefined` | Security provider에 전달하는 fallback 인증값. |
| `validator` | `ResponseValidator` | `undefined` | 전체 HTTP response를 받는 Validator 하나. |
| `dedupe` | `boolean` | `undefined` | true이면 조건에 맞는 동시 request 중복 제거. |
| `customBody` | `unknown` | `undefined` | decorator body 조립 대신 사용하는 사용자 body. |
| `userAgent` | `string` | `undefined` | request의 User-Agent header. |

URL placeholder는 protocol·host·pathPrefix·path에 쓸 수 있습니다. [URL templates](./method/url-template)에서 조합 예제를 확인하세요.

## GET and POST example

```ts twoslash
import { Body, Get, JinFrame, Param, Post } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
  timeout: 2_000,
})
class GetUserFrame extends JinFrame<{ status: 200; data: { name: string } }> {
  // Substitute the field into the URL.
  @Param()
  declare readonly id: string;
}

@Post({
  host: 'https://api.example.com',
  path: '/users',
})
class CreateUserFrame extends JinFrame<{ status: 201; data: { id: string } }> {
  // Include the field in the JSON request body.
  @Body()
  declare readonly name: string;
}

// Inspect requests without contacting the example server.
const getRequest = GetUserFrame.of({ id: '123' })._request();
const postRequest = CreateUserFrame.of({ name: 'ironman' })._request();
console.log(getRequest.method, getRequest.url);
console.log(postRequest.method, postRequest.body);
```

## Executing requests

| 메서드 | 동작 |
| --- | --- |
| `_request()` | 전송 없이 request 설정 구성. |
| `_create()` | request를 실행하는 function 반환. |
| `_execute()` | 비동기 인증값 해석 후 실행. |

실제 request는 `await GetUserFrame.of({ id: '123' })._execute()`로 보냅니다.

## Call options

| option | 동작 |
| --- | --- |
| `host, pathPrefix, path` | 이번 호출의 URL 변경. |
| `url` | host·path 조합 대신 전체 URL 지정. |
| `validateStatus` | 허용할 HTTP 상태 선택. |
| `dynamicAuth` | 이번 호출의 인증값 재정의. |
| `auth` | Basic username/password 전달. |
| `signal` | AbortSignal로 request 취소. |
| `timeout` | 이번 호출의 시도별 타임아웃(ms) 변경. |
| `cloneRaw` | body를 읽을 수 있는 raw response 복사본 보존. |
| `deserialize` | response 텍스트를 사용자 function으로 파싱. |

`validateStatus`는 HTTP decorator가 아닌 실행 시 전달합니다. 자세한 response 처리와 오류는 [상태 유니온과 오류](./method/responses)를 참고하세요.
