---
outline: deep
---

# Object bodies

`@ObjectBody()`는 field 이름으로 감싸지 않고 값을 body 자체로 사용합니다. object뿐 아니라 array·string·number·boolean을 body에 직접 전달할 때 사용합니다.

## Example

```ts twoslash
import { Post, JinFrame, ObjectBody } from 'jin-frame';

@Post({
  host: 'https://api.example.com',
  path: '/users',
})
class ExampleFrame extends JinFrame {
  // Merge this object's properties into the request body itself.
  @ObjectBody()
  declare readonly payload: { name: string; active: boolean };
}

// Build the request without contacting the placeholder server.
const frame = ExampleFrame.of({ payload: { name: 'ironman', active: true } });
const request = frame._request();
console.log(request.body);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `order` | `number` | `Number.MAX_SAFE_INTEGER` | 오름차순으로 병합하며 뒤의 속성이 앞의 값을 덮어쓸 수 있습니다. |
| `formatters` | `SingleBodyFormatter \| SingleBodyFormatter[]` | `undefined` | body field를 변환하며 findFrom으로 중첩 값을 선택합니다. |
| `cacheKeyExcludePaths` | `string[]` | `undefined` | 중복 제거 키에서만 제외할 body 경로입니다. |
| `encode` | `boolean` | `true` | field 설정으로 유지되며 body 조립에서는 URI 인코딩을 적용하지 않습니다. |

## Body shape

예제는 `{ "payload": ... }`가 아니라 `{ "name": "ironman", "active": true }`를 전송합니다. 전송 계약을 명확히 하려면 가능한 한 request당 object body field를 하나만 사용합니다. array·원시값은 서버가 해당 body를 받는 계약인지 확인합니다.

## Multiple sources

`order` 오름차순으로 object body를 병합하며 뒤의 값이 앞의 속성을 덮어쓸 수 있습니다. `@Body()`도 body 조립에 참여합니다. 경로가 겹치면 `_request().body`로 최종 결과를 확인합니다.

formatter는 병합 전에 실행됩니다. `cacheKeyExcludePaths`는 중복 판단만 바꾸며 전송 데이터를 마스킹하지 않습니다. 동시 request에서 변경 가능한 payload 공유를 피합니다.
