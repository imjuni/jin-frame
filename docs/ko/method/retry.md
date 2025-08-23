---
outline: deep
---

# Retry

`jin-frame`에서는 재시도를 단순한 옵션 설정으로 적용할 수 있습니다. 기본적으로는 일정한 간격으로 재시도하지만, 필요하다면 `getInterval` 함수를 정의하여 **재시도 횟수나 전체 소요 시간에 따라 간격을 다르게** 설정할 수도 있습니다.

## interval

가장 단순한 방식으로, **모든 재시도가 동일한 간격**으로 수행됩니다. 예를 들어 `interval: 1000`으로 설정하면 1초마다 동일한 간격으로 재시도를 진행합니다.

## getInterval

여러 클라이언트가 동시에 재시도를 수행하면, 일정한 간격의 재시도가 오히려 서버 부하를 증가시킬 수 있습니다. 이런 경우 `getInterval`을 사용하면 **재시도 횟수, 총 소요 시간** 등을 고려해 보다 유연한 간격을 적용할 수 있습니다.

```ts
@Get({ 
  path: '/api/v2/pokemon/:name',
  retry: { 
    max: 5,
    getInterval: (
      retry: number,
      totalDuration: number,
      eachDuration: number
    ): number => {
      // 전체 API 호출 시간이 10초를 초과하면 10초마다 재시도
      if (totalDuration > 10000) {
        return 10_000;
      }

      // 그 외에는 (재시도 횟수 × 1000ms) 간격으로 재시도
      return retry * 1000;
    }
  }
})
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  public declare readonly name: string;
}
```

위 예시는 다음과 같은 특징을 가집니다.

- 최대 5회까지 재시도 수행  
- 총 소요 시간이 10초를 넘으면 이후에는 10초 간격으로 재시도  
- 그 외 상황에서는 `1회차 = 1초`, `2회차 = 2초`, … 와 같이 점진적으로 간격을 늘려 재시도  

---

## Conclusion

- 단순히 **고정 간격 재시도**를 원한다면 `interval` 옵션만으로 충분합니다.  
- 서버 안정성이나 부하 분산을 고려해야 한다면 `getInterval`을 사용해 **동적으로 간격을 제어**하는 것이 좋습니다.  

이러한 기능을 통해 요청의 신뢰성을 확보하면서도, 시스템에 불필요한 부담을 주지 않는 균형 잡힌 재시도 정책을 설계할 수 있습니다.
