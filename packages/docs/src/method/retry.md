---
outline: deep
---

# Retry

Use `@Retry` to set the maximum retry count and delay. Set `interval` for a fixed delay or `getInterval` for a delay based on the retry count and elapsed time.

## interval

`interval: 1000` waits one second between attempts.

## getInterval

When multiple clients retry at the same fixed interval, it may actually increase server load. In such cases, using `getInterval` allows you to apply more flexible retry spacing based on **retry count and total duration**.

```ts
import { Get, JinFrame, Param, Retry } from 'jin-frame';

@Retry({
    max: 5,
    getInterval: (retry: number, totalDuration: number): number => {
      // If total API call time exceeds 10 seconds, retry every 10 seconds
      if (totalDuration > 10000) {
        return 10_000;
      }

      // Otherwise, retry with (retry count × 1000ms) spacing
      return retry * 1000;
    },
})
@Get({ host: 'https://pokeapi.co', path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

This example has the following characteristics:

- Retries up to 5 times
- If total elapsed time exceeds 10 seconds, subsequent retries occur every 10 seconds
- Otherwise, retries occur progressively: `1st = 1s`, `2nd = 2s`, … increasing intervals
