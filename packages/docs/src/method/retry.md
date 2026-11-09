---
outline: deep
---

# Retry and timeout

Use a fixed delay or compute it from retry count and elapsed time. `max` is the total attempt limit in the current runtime, including the initial request; `max: 3` allows at most two additional attempts. A timeout limits each fetch attempt, not the entire retry sequence.

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

1. `Retry-After` when `useRetryAfter` is enabled (the default) and a usable header exists.
2. `getInterval(retry, totalDuration, eachDuration)` when configured.
3. Fixed `interval`.

Durations and return values are milliseconds. Set `useRetryAfter: false` to choose your own delay even when the server supplies the header. Use `{ max: 3, interval: 1_000 }` for a fixed delay.

## Failure behavior

Retries apply to rejected HTTP responses and network exceptions. A call-level status policy changes which HTTP responses are rejected. Use retry hooks for observations and final `_execute()` rejection for exhausted attempts. Repeating a POST may duplicate side effects; use server-supported idempotency where required.

## Cancellation and defaults

The library default timeout is 120,000 ms. Set `@Timeout()` or the method's `timeout` option for each endpoint. A caller can pass `signal` to cancel a request. Cancellation and retry behavior are covered by the request lifecycle tests; do not use retries as a substitute for application-level cancellation.

See [hooks](./hook) for per-attempt logging and [responses](./responses) for final errors.
