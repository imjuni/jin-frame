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
class GetUserFrame extends JinFrame<User> {
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
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<User>,
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
  reply: JinResp<Pass, Fail>,
  debugInfo: DebugInfo,
): void | Promise<void>
```

| 파라미터    | 타입                  | 설명                                       |
| ----------- | --------------------- | ------------------------------------------ |
| `req`       | `JinRequestConfig`    | 전송된 요청 설정                            |
| `reply`     | `JinResp<Pass, Fail>` | 판별 유니온 응답 (`ok: true \| false`)     |
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

## 공유 베이스 프레임 패턴

훅은 상속과 함께 사용할 때 특히 강력합니다. 베이스 프레임에 훅을 한 번만 정의하면 모든 서브클래스가 자동으로 동일한 동작을 갖습니다.

```ts
import { JinFrame } from 'jin-frame';
import type { JinRequestConfig, JinResp, DebugInfo } from 'jin-frame';

abstract class ApiBase<Pass, Fail = Pass> extends JinFrame<Pass, Fail> {
  protected override async _preHook(req: JinRequestConfig): Promise<void> {
    const token = await tokenStore.get();
    req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  }

  protected override _postHook(
    req: JinRequestConfig,
    reply: JinResp<Pass, Fail>,
    debug: DebugInfo,
  ): void {
    metrics.record({ url: req.url, status: reply.status, duration: debug.duration });
  }
}

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends ApiBase<User> {
  @Param()
  declare public readonly id: string;
}

@Post({ host: 'https://api.example.com', path: '/users' })
class CreateUserFrame extends ApiBase<User> {
  @Body()
  declare public readonly name: string;
}
```

---

## 주요 활용 사례

| 활용 사례             | 훅           | 예시                                          |
| --------------------- | ------------ | --------------------------------------------- |
| 토큰 주입 / 갱신      | `_preHook`   | 요청 전 `Authorization` 헤더 첨부             |
| 요청 로깅             | `_preHook`   | 발신 URL과 메서드 로깅                         |
| 응답 로깅             | `_postHook`  | 상태 코드와 지연 시간 로깅                     |
| 메트릭 / 트레이싱     | `_postHook`  | 메트릭 수집기에 소요 시간 기록                 |
| 오류 알림             | `_postHook`  | `reply.ok === false` 시 알림 발송              |
| 캐시 무효화           | `_postHook`  | 성공적인 변경 요청 후 캐시 삭제                |
