---
outline: deep
---

# Mocking

**`jin-frame`**은 내부적으로 `fetch` API를 사용합니다. 테스트 환경에서는 [MSW (Mock Service Worker)](https://mswjs.io/)를 활용하여 실제 서버를 호출하지 않고도 네트워크 레벨에서 요청을 가로챌 수 있습니다.

## 설치

```bash
npm install --save-dev msw
```

## 기본 설정

MSW는 네트워크 레이어에서 요청을 가로채기 때문에, jin-frame 코드에는 별도의 수정이 필요하지 않습니다.

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

## 간단한 예제

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

## POST 요청 모킹

핸들러 내부에서 요청 본문을 검사할 수도 있습니다:

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

## 에러 응답 시뮬레이션

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

## 테스트별 핸들러 재정의

테스트 케이스 내에서 `server.use()`를 호출하면 해당 테스트에서만 기본 핸들러를 재정의합니다. `afterEach`의 `server.resetHandlers()`가 원래 상태로 복원합니다.

```ts
const server = setupServer(
  // 기본 핸들러: 항상 404 반환
  http.get('https://api.example.com/items', () =>
    new HttpResponse('Not Found', { status: 404 }),
  ),
);

it('should return 200 when item exists', async () => {
  // 이 테스트에서만 재정의
  server.use(
    http.get('https://api.example.com/items', () =>
      HttpResponse.json({ id: 1, name: 'item' }),
    ),
  );

  const reply = await frame._execute();
  expect(reply.status).toBe(200);
});
```

## 특징

- **실제 서버 호출 불필요** — 외부 API 서버가 준비되지 않아도 요청/응답을 흉내 낼 수 있습니다.
- **네트워크 레벨 인터셉트** — fetch, axios 등 모든 HTTP 클라이언트에서 코드 수정 없이 동작합니다.
- **테스트별 핸들러 제어** — `server.use()`로 일회성 재정의, `server.resetHandlers()`로 기본 상태 복원.
- **요청 본문 검사** — 핸들러 내부에서 실제 요청 페이로드를 읽어 정확성을 검증할 수 있습니다.

## 활용 시나리오

- 개발 단계에서 **외부 API 서버가 준비되지 않은 경우**
- QA 환경에서 **특정 에러 케이스를 재현해야 하는 경우**
- CI/CD 파이프라인에서 **네트워크 의존성을 제거한 테스트 실행**

💡 자세한 사용법은 [MSW 공식 문서](https://mswjs.io/docs/)를 참고하세요.
