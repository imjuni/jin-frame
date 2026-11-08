---
outline: deep
---

# HTTP Method 데코레이터

`jin-frame`은 HTTP 요청을 **클래스 단위**로 선언하기 위해 메서드별 데코레이터를 제공합니다.

지원 데코레이터: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@Link`, `@Unlink`, `@Purge`, `@Search`

> 핵심: **엔드포인트(호스트/경로/타임아웃/재시도/컨텐츠 타입 등)** 을 데코레이터 옵션으로 선언하고, **경로/쿼리/헤더/바디**는 `@Param`, `@Query`, `@Header`, `@Body`(또는 `@ObjectBody`)로 지정합니다.

## Quick Examples

### GET (쿼리 + 경로)

```ts
@Timeout(10_000) // 10s timeout
@Get({
  host: 'https://api.example.com',
  path: '/orgs/{orgId}/users',
  authorization: process.env.YOUR_AUTH_TOKEN,
})
export class ListUsersFrame extends JinFrame {
  @Param()
  declare readonly orgId: string;

  @Query()
  declare readonly page?: number;
}

// Execute
const frame = ListUsersFrame.of({ orgId: 'acme', page: 1 });
const reply = await frame._execute();
```

### POST (JSON 바디)

```ts
@Timeout(5_000) // 5s timeout
@Post({
  host: 'https://api.example.com',
  path: '/users',
  // 기본(contentType 미설정 시) application/json 로 전송
})
export class CreateUserFrame extends JinFrame {
  @Body('name') declare readonly name: string;
  @Body('email') declare readonly email: string;
}

// Execute
const frame = CreateUserFrame.of({ name: 'Alice', email: 'alice@acme.com' });
const res = await frame._execute();
```

### POST (multipart/form-data, 파일 업로드)

```ts
@Post({
  host: 'https://upload.example.com',
  path: '/files',
  contentType: 'multipart/form-data',
})
export class UploadFrame extends JinFrame {
  @Body()
  declare readonly title: string;

  @Body()
  declare readonly attachments: JinFile[]; // JinFile 또는 JinFile[] 지원
}

// Execute
const file = new JinFile('hello.txt', new File(['hello'], 'hello.txt'));
const frame = UploadFrame.of({ title: 'greeting', attachments: [file] });
await frame._execute();
```

### PUT / PATCH / DELETE

```ts
@Patch({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
export class UpdateUserFrame extends JinFrame {
  @Param()
  declare readonly id: string;

  @Body()
  declare readonly name?: string;
}

@Delete({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
export class DeleteUserFrame extends JinFrame {
  @Param()
  declare readonly id: string;
}
```

## 데코레이터 옵션

모든 메서드 데코레이터(`@Get`, `@Post`, …)는 공통 옵션을 받습니다.

| 옵션               | 타입                                                                                 | 설명                                                                            |
| ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `host`             | `string`                                                                             | 베이스 URL(프로토콜 포함). 예: `https://api.example.com`                        |
| `path`             | `string`                                                                             | 경로. `{id}` 처럼 **Path Param** 플레이스홀더 지원 (RFC 6570 URI Template)      |
| `pathPrefix`       | `string`                                                                             | `/api` 와 같이 path에 추가할 prefix를 설정할 수 있습니다.                       |
| `timeout`          | `number`                                                                             | 요청 타임아웃(ms). 미설정 시 라이브러리 기본값 사용                             |
| `retry`            | `{ max: number; interval?: number }` \*                                              | 재시도 설정. `max`는 최대 재시도 횟수, `interval`은 시도 간 대기(ms)              |
| `method`           | `string`                                                                             | 내부적으로 설정되지만, 커스텀 메서드가 필요하면 명시 가능                       |
| `contentType`      | `'application/json' \| 'multipart/form-data' \| 'application/x-www-form-urlencoded'` | 전송 포맷 지정                                                                  |
| `customBody`       | `unknown`                                                                            | 데코레이터/필드 바디 대신 **커스텀 바디**를 직접 지정                           |

| `userAgent`        | `string`                                                                             | User-Agent 지정. 브라우저 보안 제약으로 무시될 수 있음(옵션으로는 설정 가능)    |
| `authorization`    | `string` or `{ username: string; password: string }`                                  | Header Authorization 필드 값을 설정하거나 Basic Auth 설정을 설정                |
| `validator` | `ResponseValidator` | 전체 응답을 받는 응답 검증기. [유효성 검사](./method/validation) 참고 |

## Body 전송 규칙 & Content-Type

- `application/json` (기본): 바디 객체를 JSON으로 전송합니다.
- `multipart/form-data`: **POST, PUT, PATCH** 요청에서 내부 FormData 생성 로직이 동작합니다.
  - `JinFile`/`JinFile[]`은 파일 파트로 추가됩니다.
  - 문자열/숫자/불리언/객체는 적절히 문자열화하여 파트로 추가됩니다.
  - `Content-Type` 헤더(멀티파트 boundary 포함)는 런타임이 자동으로 설정합니다.
- `application/x-www-form-urlencoded`: 네이티브 `URLSearchParams`를 사용해 `key=value&…` 형태로 변환합니다.

## 메서드별 관례(Idempotency)

- `GET`: 조회. 바디 없이 **쿼리/헤더/경로**로 전달.
- `POST`: 생성/액션. **바디 전송** 주로 사용.
- `PUT`/`PATCH`: 갱신. 바디 전송 가능.
- `DELETE`: 삭제. 필요 시 바디/쿼리 사용(서버 규약에 따름).

라이브러리는 `fetch`의 `body`에 데이터를 전달하므로, 서버가 허용한다면 `PUT/PATCH/DELETE`에도 바디 전송이 가능합니다.

## 디버깅 팁

```ts
const frame = SomeFrame.of(/* ... */);
const req = frame._requestWrap();

console.log(frame._getOption('method')); // 설정된 HTTP 메서드
console.log(frame._getData('param')); // 최종 Path Params
console.log(frame._getData('query')); // 최종 Query
console.log(frame._getData('header')); // 최종 Header (직렬화 전)
console.log(req); // 최종 요청 설정 (JinRequestConfig)
```

> 요청 중간 상태를 확인하고 싶으면 `._requestWrap()`로 요청 설정 객체를 받아보세요.
> `._execute()`는 실제 네트워크 호출을 수행합니다.

## 상태 코드 검증

기본적으로 2xx 응답을 반환합니다. 다른 상태도 반환받으려면 `_execute()` 또는 `_create()` 호출에 `validateStatus`를 전달합니다. 6.0에서는 데코레이터 옵션으로 지정할 수 없습니다.

```ts
import { validateStatus } from 'jin-frame';

const reply = await frame._execute({
  validateStatus: validateStatus(200, 404),
});
```

`validateStatus(200, 404)`는 반환 타입도 해당 상태로 좁힙니다. `() => true`처럼 boolean을 반환하는 콜백은 선언한 전체 응답 union을 유지합니다. 네트워크 오류처럼 HTTP 응답이 없는 실패는 여전히 예외를 발생시킵니다.
