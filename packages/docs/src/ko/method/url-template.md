---
outline: deep
---

# URL templates

`@Get()` 같은 HTTP 메서드 decorator의 `host`·`pathPrefix`·`path`에 URL 템플릿을 작성하고, `@Param()` field로 placeholder 값을 전달합니다.

## Host, prefix, and path

```ts twoslash
import { Get, JinFrame, Param } from 'jin-frame';

@Get({
  host: 'https://{tenant}.api.example.com',
  pathPrefix: '/v{version}',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly tenant: string;

  @Param()
  declare readonly version: number;

  // Map a local field name to the template variable.
  @Param({ replaceAt: 'id' })
  declare readonly userId: string;
}

const frame = UserFrame.of({ tenant: 'acme', version: 2, userId: 'alice' });

// Inspect https://acme.api.example.com/v2/users/alice without sending.
console.log(frame._request().url);

// Per-call overrides also participate in template expansion.
const request = frame._request({ path: '/accounts/{id}' });
console.log(request.url);
```

placeholder 이름을 바꾸거나 값을 변환하는 option은 [Path parameters](../field/param)에서 설명합니다.
