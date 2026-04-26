---
outline: deep
---

# Mocking

**`jin-frame`** internally uses the `fetch` API. In test environments, you can use [MSW (Mock Service Worker)](https://mswjs.io/) to intercept requests at the network level without calling a real server.

## Installation

```bash
npm install --save-dev msw
```

## Basic Setup

MSW intercepts requests at the network layer, so no changes to your jin-frame code are required.

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer();

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});
```

## Simple Example

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { Get, JinFrame } from 'jin-frame';
import { Query } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users' })
class UserFrame extends JinFrame<{ users: { id: number; name: string }[] }> {
  @Query()
  declare public readonly searchText: string;
}

const server = setupServer();

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

it('should return mocked users', async () => {
  server.use(
    http.get('https://api.example.com/users', () =>
      HttpResponse.json({ users: [{ id: 1, name: 'John Smith' }] }),
    ),
  );

  const frame = UserFrame.of({ searchText: 'John' });
  const reply = await frame._execute();

  console.log(reply.data);
  // { users: [{ id: 1, name: 'John Smith' }] }
});
```

## Mocking POST Requests

You can also inspect request bodies inside the handler:

```ts
import { http, HttpResponse, PathParams } from 'msw';

interface LoginBody {
  username: string;
  password: string;
}

server.use(
  http.post<PathParams, LoginBody>(
    'https://api.example.com/login',
    async ({ request }) => {
      const body = await request.json();
      if (body.username === 'ironman' && body.password === 'marvel') {
        return HttpResponse.json({ token: 'secret-token' });
      }
      return new HttpResponse('Unauthorized', { status: 401 });
    },
  ),
);
```

## Simulating Error Responses

```ts
server.use(
  http.get('https://api.example.com/users', () =>
    new HttpResponse('Internal Server Error', { status: 500 }),
  ),
);

await expect(frame._execute()).rejects.toMatchObject({
  resp: { status: 500 },
});
```

## Per-Test Handler Override

`server.use()` called inside a test case overrides the default handler only for that test. `server.resetHandlers()` in `afterEach` restores the original state.

```ts
const server = setupServer(
  // Default handler: always returns 404
  http.get('https://api.example.com/items', () =>
    new HttpResponse('Not Found', { status: 404 }),
  ),
);

it('should return 200 when item exists', async () => {
  // Override for this test only
  server.use(
    http.get('https://api.example.com/items', () =>
      HttpResponse.json({ id: 1, name: 'item' }),
    ),
  );

  const reply = await frame._execute();
  expect(reply.status).toBe(200);
});
```

## Key Features

- **No real server required** — simulate request/response cycles even when the external API server is unavailable.
- **Network-level interception** — works with any HTTP client (fetch, axios, etc.) without code changes.
- **Per-test handler control** — `server.use()` adds one-time overrides; `server.resetHandlers()` restores defaults.
- **Request body inspection** — read the actual request payload inside handlers to verify correctness.

## Use Cases

- During development, when an **external API server is not yet available**
- In QA environments, when you need to **reproduce specific error scenarios**
- In CI/CD pipelines, when running tests that **remove network dependencies**

💡 For more details, refer to the [official MSW documentation](https://mswjs.io/docs/).
