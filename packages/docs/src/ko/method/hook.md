---
outline: deep
---

# Lifecycle hooks

훅은 request 실행을 관찰하거나 조정합니다. response의 업무 처리는 호출자에 두고 공통 전송 동작은 부모 프레임으로 묶습니다.

## Request and response hooks

```ts twoslash
import { Get, JinFrame } from 'jin-frame';
import type { DebugInfo, JinRequestConfig, JinResp } from 'jin-frame';

type Replies = { status: 200; data: { name: string } };

@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class ProfileFrame extends JinFrame<Replies> {
  protected override _preHook(request: JinRequestConfig): void {
    // Mutating the built request changes the outgoing HTTP request.
    request.headers = { ...request.headers, 'X-Client': 'web' };
  }

  protected override _postHook(request: JinRequestConfig, reply: JinResp<Replies>, debug: DebugInfo): void {
    // Log metadata only; avoid leaking headers or response secrets.
    console.log(request.method, reply.status, debug.duration);
  }
}
```

## Hook boundaries

| 훅 | 입력 | 실행 시점 |
| --- | --- | --- |
| `_preHook` | JinRequestConfig | 전송·재시도 과정 시작 전 한 번 |
| `_postHook` | request·response·디버그 정보 | HTTP response 처리 후, 거부 상태 포함 |
| `_retryFail` | request·네이티브 Response 복사본 | 거부된 HTTP 시도마다, 마지막 포함 |
| `_retryException` | request·Error | 전송 예외마다, 마지막 포함 |

훅은 `void` 또는 `Promise<void>`를 반환합니다. HTTP response가 없으면 `_postHook`에 response를 전달할 수 없습니다. 최종 결과는 `_execute()`에서 처리합니다. 재시도 훅은 관찰 지점이며 반환값으로 복구하는 API가 아닙니다.

## Exceptions and ordering

pre-hook 예외는 전송을 막습니다. post-hook·Validator 예외는 서버 response 후에도 실행을 실패시킬 수 있습니다. 최종 래핑 오류에는 확보된 response와 원인이 유지됩니다. 성공 반환이 없다는 이유로 서버가 쓰기를 수행하지 않았다고 가정하지 않습니다.

## Shared hooks

부모 프레임에 훅을 두고 부모·자식 동작이 모두 필요하면 `super`를 호출합니다. instance 속성을 실행별 상태로 사용하면 동시 실행에서 경합할 수 있으므로 지역 값이나 별도 instance를 사용합니다.
