---
outline: deep
---

# Testing with MSW

MSW는 프레임 코드를 변경하지 않고 네이티브 fetch를 가로챕니다. request 구성·허용 response·거부 상태·네트워크 실패를 나눠 검증합니다.

```sh
pnpm add -D msw vitest
```

## A complete Node test

핸들러의 호스트·경로는 프레임과 일치해야 합니다. 각 테스트 후 핸들러를 초기화하고 전체 테스트가 끝나면 서버를 닫습니다.

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

`server.use()`로 `new HttpResponse(null, { status: 500 })`을 반환하고 `JinRespError.resp.status`를 확인합니다. `HttpResponse.error()`는 네트워크 실패를 만들며 `resp`가 undefined인지 확인합니다. 전송 오류에 가짜 response 상태를 가정하지 않습니다.

타임아웃·재시도 테스트는 짧은 간격 또는 의도적인 fake timer를 사용합니다. 재현 가능한 CI를 위해 공개 PokeAPI에 실제 request하지 않습니다. 잘못된 body를 반환해 schema 검증의 `value`·`exception` 정책도 확인합니다.

## Configuration-only tests

MSW 없이 `_request()`로 URL·header·body를 검사할 수 있습니다. fetch나 비동기 인증값 해석은 수행하지 않습니다. 비동기 인증 function 테스트는 `_execute()`를 사용합니다.
