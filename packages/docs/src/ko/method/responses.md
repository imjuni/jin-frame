---
outline: deep
---

# Response status unions and errors

프레임은 `{ status, data }` 유니온 하나로 response를 선언합니다. `status`로 분기하면 해당 body type로 좁혀집니다. 기본 호출은 2xx를 허용하고 선언된 성공 변형을 반환합니다. HTTP 허용은 body 검증이 아닙니다.

## Select accepted statuses

```ts twoslash
import { Get, JinFrame, JinRespError, validateStatus } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
})
class UserFrame extends JinFrame<Replies> {}

try {
  // The typed predicate includes both declared response variants.
  const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });

  if (reply.status === 404) {
    // Hover over data to see the error-body type.
    console.log(reply.data.message);
  } else {
    console.log(reply.data.name);
  }
} catch (error) {
  // Let unrelated errors propagate instead of treating them as HTTP failures.
  if (!(error instanceof JinRespError)) {
    throw error;
  }

  // Only an attached response represents an actual HTTP response.
  const response = error.resp;

  if (response === undefined) {
    // Network or pre-response processing failures may have no response.
    console.error(error.message, error.cause);
  } else {
    console.error(response.status, response.data, response.headers);
  }
}
```

## Policy and inference

`validateStatus`는 메서드 decorator가 아니라 `_execute()` 또는 `_create()` 호출 option입니다. `validateStatus(200, 404)`는 상태와 body의 관계를 유지합니다. `() => true`는 선언된 모든 변형을 반환하며 일반 boolean 콜백은 type를 좁히지 않습니다. `status: number`처럼 넓은 type는 그대로 유지됩니다.

`ok`는 런타임 HTTP 허용 여부이지 body의 판별자가 아닙니다. type 분기는 `status`를 사용합니다. 오류 상태를 의도적으로 허용해도 Validator는 그 상태의 schema를 선택해야 합니다.

## Response presence

`JinRespError.resp`는 undefined일 수 있습니다. 네트워크 실패에 가짜 HTTP 500 response를 만들지 않습니다. response 없는 오류의 status/statusText는 진단값이며 서버가 response했다는 뜻이 아닙니다. 원인은 `cause`로 확인합니다.

HTTP response가 있으면 오류에 실제 상태·header·raw response와 확보된 body·검증 결과가 유지됩니다. 역직렬화·Validator·훅의 예외는 서버 response 후 처리 중에도 발생하므로 모든 오류를 네트워크 장애로 분류하지 않습니다.

`validateStatus: () => true`는 HTTP 상태만 허용합니다. 전송·취소·처리 실패는 여전히 발생합니다. `exception` 검증 모드에서는 허용된 response의 schema 실패가 `JinValidationError`를 발생시킵니다.

## Cancellation is independent of status acceptance

`validateStatus: () => true`는 HTTP 상태 때문에 발생하는 예외만 막으며 `_execute()`의 성공 반환을 보장하지 않습니다. 호출자의 `AbortSignal`이 취소되면 `throwIfAborted()`가 전송·재시도를 중단합니다. 취소는 `JinRespError`로 감싸지며 `cause`에 취소 원인을 담습니다. HTTP response를 받지 못했다면 `resp`는 undefined입니다. 명시적인 검사 코드를 제거해도 fetch 자체가 취소 시 reject합니다.

## Raw response and timing

파싱 후 raw body도 읽어야 하면 `cloneRaw: true`를 사용합니다. 메모리 사용량이 늘어납니다. `_startAt`, `_eachStartAt`, `_endAt`는 가장 최근 시작한 실행의 상태이며 동시 request 전체의 불변 로그가 아닙니다.

### 공통 기본 정책

공통 BaseFrame에서 `public override readonly _validateStatus = (ok: boolean, status: number) => ...`를 선언하면 하위 프레임이 정책을 상속합니다. 기본 구현은 `ok`를 반환하며, 호출 옵션의 `validateStatus`가 멤버보다 우선합니다. 이 정책은 재시도와 최종 응답 판정에 함께 적용됩니다.

멤버 override는 반환 타입 추론에 반영되지 않습니다. 호출 옵션을 생략하면 기존처럼 선언된 2xx 응답만 추론합니다. 허용 범위를 확장한 사용자가 타입과 실제 응답의 차이를 관리해야 합니다. 상태에 맞는 타입 추론이 필요하면 호출 옵션을 사용하세요.
