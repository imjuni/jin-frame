---
outline: deep
---

# Retry and timeout

고정 간격을 쓰거나 재시도 횟수·경과 시간으로 간격을 계산합니다. `max`는 현재 런타임에서 최초 request를 포함한 전체 시도 한도입니다. `max: 3`이면 추가 시도는 최대 두 번입니다. 타임아웃은 전체 재시도 과정이 아닌 각 fetch 시도에 적용됩니다.

## Configure an endpoint

```ts twoslash
import { Get, JinFrame, Retry, Timeout } from 'jin-frame';

// Limit each attempt to two seconds.
@Timeout(2_000)
@Retry({
  max: 3,
  // Use bounded exponential backoff unless Retry-After takes precedence.
  getInterval: (retry) => Math.min(1_000 * 2 ** retry, 30_000),
})
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/pikachu',
})
class PokemonFrame extends JinFrame {}

const reply = await PokemonFrame.of()._execute();
```

## Delay precedence

1. `useRetryAfter`가 활성화되어 있고 유효한 header가 있으면 `Retry-After` 사용 (기본 활성화).
2. 설정되어 있으면 `getInterval(retry, totalDuration, eachDuration)` 사용.
3. 고정 `interval` 사용.

경과 시간과 반환값의 단위는 ms입니다. 서버 header 대신 직접 정한 간격을 쓰려면 `useRetryAfter: false`를 설정합니다. 고정 간격은 `{ max: 3, interval: 1_000 }`입니다.

## Failure behavior

HTTP 거부 response와 네트워크 예외를 재시도합니다. 호출별 상태 정책이 어떤 HTTP response를 거부할지 결정합니다. 시도 관찰은 재시도 훅으로, 최종 실패는 `_execute()`의 rejection으로 처리합니다. POST 재전송은 부수 효과를 중복시킬 수 있으므로 필요한 경우 서버의 멱등성 기능을 사용합니다.

## Cancellation and defaults

라이브러리 기본 타임아웃은 120,000ms입니다. `@Timeout()` 또는 메서드 option `timeout`으로 엔드포인트별 설정을 합니다. 호출자는 `signal`을 전달해 취소할 수 있습니다. 재시도는 애플리케이션의 취소 처리를 대신하지 않습니다.

[훅](./hook)과 [response 오류](./responses)를 함께 확인하세요.
