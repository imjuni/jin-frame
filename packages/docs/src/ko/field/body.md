---
outline: deep
---

# Body fields

`@Body()`는 개별 field로 request body를 구성합니다. 기본 형식은 JSON입니다. header·query와 달리 body의 `replaceAt`은 중첩 경로를 표현할 수 있습니다.

## Example

```ts twoslash
import { Post, JinFrame, Body } from 'jin-frame';

@Post({
  host: 'https://api.example.com',
  path: '/users',
})
class ExampleFrame extends JinFrame {
  // Assign the field to a nested JSON path.
  @Body({ replaceAt: 'profile.name' })
  declare readonly name: string;

  @Body()
  declare readonly active?: boolean;
}

// Build the request without contacting the placeholder server.
const frame = ExampleFrame.of({ name: 'ironman', active: false });
const request = frame._request();
// Output: serialized JSON request body.
console.log(request.body);
// {"profile":{"name":"ironman"},"active":false}
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAt` | `string` | field 이름 | body 속성 이름 또는 점으로 구분한 중첩 경로입니다. |
| `formatters` | `SingleBodyFormatter \| SingleBodyFormatter[]` | `undefined` | body field를 변환하며 findFrom으로 중첩 값을 선택합니다. |
| `cacheKeyExcludePaths` | `string[]` | `undefined` | 중복 제거 키에서만 제외할 body 경로입니다. |
| `encode` | `boolean` | `true` | field 설정으로 유지되며 body 조립에서는 URI 인코딩을 적용하지 않습니다. |

## Serialization

jin-frame은 decorator field로 object를 조립한 뒤, fetch에 전달할 JSON body를 `JSON.stringify()`로 직렬화합니다. 따라서 `_request().body`에는 object가 아닌 string이 들어 있으며, 위의 console 출력이 그 결과입니다.

`@Body()`는 값을 field 이름 또는 `replaceAt` 경로 아래에 넣습니다. array·string·number·boolean 등을 body 자체로 전달하려면 [`@ObjectBody()`](./objectbody)를 사용합니다.

field 이름이 `payload`일 때 직렬화된 JSON은 다음과 같습니다:

| Value | `@Body()` | `@ObjectBody()` |
| --- | --- | --- |
| `['a', 'b']` | `{"payload":["a","b"]}` | `["a","b"]` |
| `'ironman'` | `{"payload":"ironman"}` | `"ironman"` |
| `42` | `{"payload":42}` | `42` |
| `true` | `{"payload":true}` | `true` |

## Transformations and identity

body formatter는 type별 핸들러와 object 경로 선택을 지원하며 직렬화 전에 실행됩니다. `cacheKeyExcludePaths`는 전송 데이터를 제거하지 않고 중복 판단에서만 제외합니다. response 식별에 영향 없는 값만 제외합니다.

[object body](./objectbody), [formatter](./formatters), [폼](../method/form)을 참고하세요.
