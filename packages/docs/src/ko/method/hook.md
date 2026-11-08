---
outline: deep
---

# Hooks

`JinFrame`은 HTTP 요청의 **직전**과 **직후**에 실행되는 두 가지 라이프사이클 훅을 제공합니다. 서브클래스에서 이를 오버라이드하면 로깅, 토큰 주입, 메트릭 수집 등의 횡단 관심사를 프레임의 핵심 요청 로직을 건드리지 않고 추가할 수 있습니다.

## \_preHook

HTTP 요청이 전송되기 직전에 실행됩니다. 완전히 구성된 `JinRequestConfig`를 받으므로 토큰 갱신 등 요청 직전 작업을 수행할 수 있습니다.

```ts
import { Get, JinFrame } from 'jin-frame';
import type { JinRequestConfig } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<{ status: number; data: User }> {
  @Param()
  declare public readonly id: string;

  protected override async _preHook(req: JinRequestConfig): Promise<void> {
    const token = await getAccessToken(); // 필요 시 토큰 갱신
    req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  }
}
```

### 시그니처

```ts
protected _preHook(req: JinRequestConfig): void | Promise<void>
```

| 파라미터 | 타입               | 설명                       |
| -------- | ------------------ | -------------------------- |
| `req`    | `JinRequestConfig` | 전송 직전의 요청 설정 객체  |

> `_preHook` 내에서 `req`를 변경하면 **실제 요청에 반영**됩니다.

---

## \_postHook

HTTP 응답 수신 후(성공·실패 모두)에 실행됩니다. 요청 설정, 판별 유니온 응답, 디버그 타이밍 정보를 받습니다.

```ts
import { Get, JinFrame } from 'jin-frame';
import type { JinRequestConfig, JinResp, DebugInfo } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<{ status: number; data: User }> {
  @Param()
  declare public readonly id: string;

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<{ status: number; data: User }>,
    debug: DebugInfo,
  ): void {
    console.log(`[${reply.ok ? 'OK' : 'FAIL'}] ${req.url} — ${debug.duration}ms`);
  }
}
```

### 시그니처

```ts
protected _postHook(
  req: JinRequestConfig,
  reply: JinResp<OperationResponse>,
  debugInfo: DebugInfo,
): void | Promise<void>
```

| 파라미터    | 타입                  | 설명                                       |
| ----------- | --------------------- | ------------------------------------------ |
| `req`       | `JinRequestConfig`    | 전송된 요청 설정                            |
| `reply`     | `JinResp<OperationResponse>` | 숫자 `status`로 구분하는 응답 union     |
| `debugInfo` | `DebugInfo`           | 타이밍 및 중복 제거 메타데이터              |

### DebugInfo

```ts
interface DebugInfo {
  ts: { unix: string; iso: string }; // 요청 시작 타임스탬프
  duration: number;                  // 전체 요청 소요 시간 (ms)
  isDeduped: boolean;                // 중복 제거 여부
  req: JinRequestConfig;             // 요청 설정 스냅샷
}
```

---

`ok`는 `validateStatus`가 응답을 수용했는지를 나타내는 boolean이며 타입 판별자가 아닙니다. `validateStatus: () => true`로 수용한 404도 `ok: true`입니다. `data` 타입은 `status`로 좁힙니다. 훅은 수용·거부된 HTTP 응답에 동일한 응답 union을 사용합니다.

## \_retryFail

**HTTP 응답은 받았지만 상태 코드가 실패**인 경우(즉, `validateStatus`가 `false`를 반환) 각 시도 이후에 호출됩니다. 재시도가 소진되는 마지막 시도 후에도 한 번 더 호출됩니다.

이 훅은 재시도 횟수 로깅, 메트릭 업데이트, 일시적 장애 알림 등에 활용합니다.

```ts
import { Post, JinFrame } from 'jin-frame';
import type { JinRequestConfig } from 'jin-frame';

@Post({ host: 'https://api.example.com', path: '/submit', retry: { max: 3, interval: 500 } })
class SubmitFrame extends JinFrame<{ status: number; data: Result }> {
  @Body()
  declare public readonly payload: string;

  protected override _retryFail(req: JinRequestConfig, res: Response): void {
    console.warn(`[retry-fail] ${req.url} → ${res.status} (시도 ${this._getData('retry')?.try}회)`);
  }
}
```

### 시그니처

```ts
protected _retryFail(req: JinRequestConfig, res: Response): void | Promise<void>
```

| 파라미터 | 타입               | 설명                                                  |
| -------- | ------------------ | ----------------------------------------------------- |
| `req`    | `JinRequestConfig` | 전송된 요청 설정                                       |
| `res`    | `Response`         | Response 객체의 복제본 (body를 안전하게 읽을 수 있음) |

> `_retryFail`은 재시도가 소진될 때가 아니라 **실패한 모든 시도마다** 호출됩니다. 최종 결과가 필요하다면 `_postHook`을 사용하세요.

---

## \_retryException

각 시도에서 **에러가 발생**한 경우(네트워크 단절, 타임아웃, 연결 거부 등) 호출됩니다. 마지막 시도에서도 에러가 발생하면 한 번 더 호출됩니다.

연결 문제 로깅이나 반복적 예외에 대한 알림 트리거에 활용합니다.

```ts
import { Post, JinFrame } from 'jin-frame';
import type { JinRequestConfig } from 'jin-frame';

@Post({ host: 'https://api.example.com', path: '/submit', retry: { max: 3, interval: 500 } })
class SubmitFrame extends JinFrame<{ status: number; data: Result }> {
  @Body()
  declare public readonly payload: string;

  protected override _retryException(req: JinRequestConfig, err: Error): void {
    console.error(`[retry-exception] ${req.url} → ${err.message}`);
  }
}
```

### 시그니처

```ts
protected _retryException(req: JinRequestConfig, err: Error): void | Promise<void>
```

| 파라미터 | 타입               | 설명                           |
| -------- | ------------------ | ------------------------------ |
| `req`    | `JinRequestConfig` | 전송된 요청 설정               |
| `err`    | `Error`            | fetch 시도 중 발생한 에러 객체 |

> `_retryException`은 마지막 오류를 포함해 **오류가 발생한 모든 시도마다** 호출됩니다. HTTP 응답이 없으면 `_postHook`이 호출되지 않으므로, 최종 실패는 `_execute()`의 예외를 처리해 확인하세요.

---

## 훅 실행 흐름

아래 다이어그램은 전체 요청 라이프사이클에서 각 훅이 언제 호출되는지를 보여줍니다.

```mermaid
sequenceDiagram
    participant Caller
    participant JinFrame
    participant Server as HTTP Server

    Caller->>JinFrame: _execute(option)
    JinFrame->>JinFrame: resolveSecurityKey()
    JinFrame->>JinFrame: _requestWrap() → req
    JinFrame->>JinFrame: _preHook(req)

    loop 최대 retry.max 회 시도
        JinFrame->>Server: fetch(req)
        alt 성공 — validateStatus = true
            Server-->>JinFrame: Response (ok)
            Note over JinFrame: 즉시 루프 종료
        else 응답 실패 — validateStatus = false
            Server-->>JinFrame: Response (not ok)
            JinFrame->>JinFrame: _retryFail(req, Response)
            Note over JinFrame: sleep(interval) → 다음 시도
        else 네트워크/타임아웃 에러
            Server-->>JinFrame: throws Error
            JinFrame->>JinFrame: _retryException(req, Error)
            Note over JinFrame: sleep(interval) → 다음 시도
        end
    end

    Note over JinFrame: 재시도 소진 또는 성공

    alt 마지막 결과 = Response
        JinFrame->>JinFrame: 응답 본문 파싱
        alt validateStatus 통과 (성공)
            JinFrame->>JinFrame: pass validator 실행
            JinFrame->>JinFrame: _postHook(req, JinResp, debugInfo)
            alt validator 통과 OR type = 'value'
                JinFrame-->>Caller: JinResp ✓
            else validator 실패 AND type = 'exception'
                JinFrame-->>Caller: throw JinValidationError
            end
        else validateStatus 실패 (재시도 소진)
            JinFrame->>JinFrame: fail validator 실행
            JinFrame->>JinFrame: _postHook(req, JinResp, debugInfo)
            JinFrame-->>Caller: throw JinRespError
        end
    else 마지막 결과 = Error (네트워크 에러로 소진)
        JinFrame->>JinFrame: JinRespError로 래핑
        JinFrame-->>Caller: throw JinRespError
    end
```

### 훅 요약

| 훅                  | 호출 시점                   | 호출 횟수 | 주요 용도                              |
| ------------------- | --------------------------- | --------- | -------------------------------------- |
| `_preHook`          | 재시도 루프 시작 전          | 1회       | 토큰 주입, 요청 로깅                   |
| `_retryFail`        | 응답 실패한 각 시도 후       | 0 – N회   | 재시도 로깅, 일시적 오류 메트릭        |
| `_retryException`   | 네트워크 에러가 발생한 각 시도 후 | 0 – N회 | 연결 문제 알림, 에러 로깅              |
| `_postHook`         | 재시도 루프 종료 후          | 1회       | 응답 로깅, 메트릭 기록, 캐시 무효화   |

---

## 공유 베이스 프레임 패턴

훅은 상속과 함께 사용할 때 특히 강력합니다. 베이스 프레임에 훅을 한 번만 정의하면 모든 서브클래스가 자동으로 동일한 동작을 갖습니다.

```ts
import { JinFrame } from 'jin-frame';
import type { JinRequestConfig, JinResp, DebugInfo } from 'jin-frame';

type UserResponse =
  | { status: 200; data: User }
  | { status: 201; data: User }
  | { status: 404; data: { message: string } };

abstract class ApiBase<OperationResponse extends { status: number; data: unknown }> extends JinFrame<OperationResponse> {
  protected override async _preHook(req: JinRequestConfig): Promise<void> {
    const token = await tokenStore.get();
    req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  }

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<OperationResponse>,
    debug: DebugInfo,
  ): void {
    metrics.record({ url: req.url, status: reply.status, duration: debug.duration });
  }
}

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends ApiBase<UserResponse> {
  @Param()
  declare public readonly id: string;
}

@Post({ host: 'https://api.example.com', path: '/users' })
class CreateUserFrame extends ApiBase<UserResponse> {
  @Body()
  declare public readonly name: string;
}
```

---

## 주요 활용 사례

| 활용 사례               | 훅                  | 예시                                              |
| ----------------------- | ------------------- | ------------------------------------------------- |
| 토큰 주입 / 갱신        | `_preHook`          | 요청 전 `Authorization` 헤더 첨부                 |
| 요청 로깅               | `_preHook`          | 발신 URL과 메서드 로깅                             |
| 재시도 시도 로깅        | `_retryFail`        | 실패 시 상태 코드와 재시도 횟수 로깅               |
| 네트워크 에러 로깅      | `_retryException`   | 네트워크 에러 메시지 로깅                          |
| 최종 응답 로깅          | `_postHook`         | 최종 상태 코드와 지연 시간 로깅                    |
| 메트릭 / 트레이싱       | `_postHook`         | 메트릭 수집기에 소요 시간 기록                     |
| 오류 알림               | `_postHook`         | `reply.ok === false` 시 알림 발송                  |
| 캐시 무효화             | `_postHook`         | 성공적인 변경 요청 후 캐시 삭제                    |


## 응답이 없는 오류 처리

`JinRespError.resp`는 완전한 HTTP 응답 객체이거나 `undefined`입니다. 응답이 없는 네트워크 오류에서는 `data`, `headers`, `raw`를 가진 가짜 응답을 만들지 않습니다. 원본 오류는 `cause`에 보존됩니다.

HTTP 상태가 거부된 경우에는 `resp`에 실제 응답의 `status`, `data`, `headers`, `raw`와 검증 결과가 유지됩니다. `resp`가 없을 때 오류 객체의 `status`·`statusText`는 내부 진단용 값입니다. 기본값인 `500`·`Internal Server Error`는 서버가 실제로 500을 반환했다는 의미가 아닙니다.

`validateStatus: () => true`도 네트워크 오류를 반환값으로 바꾸지 않습니다. 응답 생성 전후의 훅 또는 역직렬화 과정에서 발생한 오류도 `JinRespError`로 래핑될 수 있으므로, `resp === undefined`만으로 네트워크 장애라고 단정하지 말고 `cause`를 함께 확인합니다.

```ts
import { JinRespError } from 'jin-frame';

try {
  await frame._execute();
} catch (error) {
  if (!(error instanceof JinRespError)) throw error;

  const response = error.resp;
  if (response === undefined) {
    console.error(error.message, error.cause);
  } else {
    console.error(response.status, response.data, response.headers);
  }
}
```

응답이 없는 네트워크 오류에서는 `_postHook`이 호출되지 않습니다. `_retryException`은 각 실패 시도를 관찰하고, 최종 실패는 `_execute()`의 예외를 처리해 확인합니다. `getError`로 오류를 변환하면 호출자는 해당 핸들러가 반환한 오류를 받습니다.
