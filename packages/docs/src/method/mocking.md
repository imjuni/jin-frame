---
outline: deep
---

# Testing with MSW

MSW intercepts native fetch requests without changing frame code. Test request construction, accepted responses, rejected statuses, and network failures separately.

```sh
pnpm add -D msw vitest
```

## A complete Node test

The handler host/path must match the frame. Replace global server handlers per test and close the server after the suite.

```ts
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Get, JinFrame, Param } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
class UserFrame extends JinFrame<{ status: 200; data: { id: string; name: string } }> {
  @Param()
  declare readonly id: string;
}

const server = setupServer(
  http.get('https://api.example.com/users/:id', ({ params }) => {
    // MSW uses :id syntax; jin-frame URL templates use {id}.
    return HttpResponse.json({ id: params.id, name: 'Iron Man' });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should return user data when the API responds successfully', async () => {
  const reply = await UserFrame.of({ id: '123' })._execute();

  // Assert the response contract without contacting a real API server.
  expect(reply.status).toBe(200);
  expect(reply.data).toEqual({ id: '123', name: 'Iron Man' });
});
```

## Failure scenarios

Use `server.use()` to return `new HttpResponse(null, { status: 500 })` and assert rejection with `JinRespError.resp.status`. Return `HttpResponse.error()` for a network failure and assert `resp` is undefined. Avoid asserting a synthetic response status for transport errors.

For timeouts and retries, keep intervals short or use fake timers deliberately. Do not run tests against public PokeAPI for reproducible CI. For schema validation, return malformed JSON-shaped bodies and assert the chosen `value` or `exception` policy.

## Configuration-only tests

Use `_request()` to assert URL, headers, and body without setting up MSW. It does not perform fetch or await asynchronous authentication suppliers. Use `_execute()` when testing those suppliers.
