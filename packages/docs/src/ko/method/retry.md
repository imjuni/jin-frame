---
outline: deep
---

# Retry

`@Retry`로 최대 재시도 횟수와 대기 시간을 설정합니다. 고정 대기 시간은 `interval`로, 시도 횟수나 경과 시간에 따라 달라지는 대기 시간은 `getInterval`로 지정합니다.

## interval

`interval: 1000`은 다음 시도 전까지 1초를 기다립니다.

## getInterval

여러 클라이언트가 동시에 재시도를 수행하면, 일정한 간격의 재시도가 오히려 서버 부하를 증가시킬 수 있습니다. 이런 경우 `getInterval`을 사용하면 **재시도 횟수, 총 소요 시간** 등을 고려해 보다 유연한 간격을 적용할 수 있습니다.

```ts
import { Get, JinFrame, Param, Retry } from 'jin-frame';

@Retry({
    max: 5,
    getInterval: (retry: number, totalDuration: number): number => {
      // Wait 10 seconds if total elapsed time exceeds 10 seconds
      if (totalDuration > 10000) {
        return 10_000;
      }

      // Otherwise, wait retry count times 1000ms
      return retry * 1000;
    },
})
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
class PokemonByNameId extends JinFrame {
  @Param()
  public declare readonly name: string;
}
```

위 예시는 다음과 같은 특징을 가집니다.

- 최대 5회까지 재시도 수행
- 총 소요 시간이 10초를 넘으면 이후에는 10초 간격으로 재시도
- 그 외 상황에서는 `1회차 = 1초`, `2회차 = 2초`, … 와 같이 점진적으로 간격을 늘려 재시도
