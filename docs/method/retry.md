---
outline: deep
---

# Retry

In **`jin-frame`**, retries can be applied with a simple option configuration. By default, retries occur at fixed intervals, but you can define a `getInterval` function to **dynamically adjust intervals based on retry count or total elapsed time**.

## interval

The simplest approach is to retry at a **constant interval**. For example, setting `interval: 1000` will retry every second at a fixed interval.

## getInterval

When multiple clients retry at the same fixed interval, it may actually increase server load. In such cases, using `getInterval` allows you to apply more flexible retry spacing based on **retry count and total duration**.

```ts
@Get({
  path: '/api/v2/pokemon/:name',
  retry: {
    max: 5,
    getInterval: (retry: number, totalDuration: number, eachDuration: number): number => {
      // If total API call time exceeds 10 seconds, retry every 10 seconds
      if (totalDuration > 10000) {
        return 10_000;
      }

      // Otherwise, retry with (retry count × 1000ms) spacing
      return retry * 1000;
    },
  },
})
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  declare public readonly name: string;
}
```

This example has the following characteristics:

- Retries up to 5 times
- If total elapsed time exceeds 10 seconds, subsequent retries occur every 10 seconds
- Otherwise, retries occur progressively: `1st = 1s`, `2nd = 2s`, … increasing intervals

---

## Conclusion

- If you only need **fixed interval retries**, the `interval` option is sufficient.
- If you need to consider server stability or load balancing, use `getInterval` to **dynamically control intervals**.

These features let you design a retry policy that ensures request reliability while avoiding unnecessary stress on the system.
