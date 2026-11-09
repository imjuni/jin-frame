---
outline: deep
---

# Concurrent request deduplication

`@Dedupe()`는 동일한 request가 진행 중일 때 fetch를 공유합니다. 영구 response 캐시가 아니며 완료·실패 후 항목을 제거합니다.

## Concurrent calls

```ts twoslash
import { Dedupe, Get, JinFrame, Param } from 'jin-frame';

@Dedupe()
@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly id: string;
}

// Concurrent equivalent requests can share one network operation.
const replies = await Promise.all([
  UserFrame.of({ id: '123' })._execute(),
  UserFrame.of({ id: '123' })._execute(),
]);

// Each caller receives an independently readable reconstructed response.
console.log(replies.map((reply) => reply.status));
```

## Eligibility and identity

호출자 signal이 없고 body가 없거나 string일 때만 공유합니다. FormData·스트림·호출자 취소 제어는 공유하지 않습니다. 실제 URL·메서드·body·header·인증정보·타임아웃·관련 request 설정이 전송 식별에 반영되며 서로 다른 인증 request를 공유해서는 안 됩니다.

## Exclusions

field의 `cacheKeyExclude`와 body의 `cacheKeyExcludePaths`는 전송 값을 제거하지 않고 decorator field의 중복 식별만 바꿉니다. response 내용에 영향 없는 값만 제외합니다. 시각 정보는 가능할 수 있지만 계정 식별자·접근 토큰은 적합하지 않습니다.

## Responses and failures

공유 response를 버퍼링한 뒤 호출자별로 재구성하며 body 없는 상태는 빈 body를 유지합니다. HTTP 허용과 검증은 각 호출자에서 수행합니다. `_postHook`의 `DebugInfo.isDeduped`는 진행 중 작업에 합류했음을 나타내며 과거 response 캐시 적중이 아닙니다.

멱등적인 조회에 우선 적용합니다. 중복 제거가 쓰기 작업의 반복을 안전하게 만들거나 서버의 멱등성 키를 대신하지는 않습니다.
