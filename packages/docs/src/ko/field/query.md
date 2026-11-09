---
outline: deep
---

# Query parameters

`@Query()`는 field 값을 URL query string에 추가합니다. `replaceAt`으로 코드의 이름과 전송 이름을 분리하고 array 직렬화는 서버 계약에 맞춥니다.

## Example

```ts twoslash
import { Get, JinFrame, Query } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/search',
})
class ExampleFrame extends JinFrame {
  // Rename a TypeScript field to the API's query parameter.
  @Query({ replaceAt: 'q' })
  declare readonly search: string;

  // Serialize arrays as repeated bracketed query keys.
  @Query({ keyFormat: 'brackets' })
  declare readonly tags?: string[];
}

// Build the request without contacting the placeholder server.
const frame = ExampleFrame.of({ search: 'hello world', tags: ['red', 'blue'] });
const request = frame._request();
console.log(request.url);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAt` | `string` | field 이름 | 전송할 query 키 이름입니다. |
| `encode` | `boolean` | `true` | query 값을 URI 인코딩합니다. |
| `comma` | `boolean` | `false` | array 값을 쉼표로 연결합니다. |
| `separator` | `',' \| ' ' \| '\|'` | `undefined` | array 연결 구분자입니다. 지정하면 comma보다 우선합니다. |
| `keyFormat` | `'brackets' \| 'indices' \| 'one-indices'` | `undefined` | array query 키 형식입니다. 미지정 시 같은 키를 반복합니다. |
| `bit.enable` | `boolean` | `false` | 숫자 array를 비트 OR 값으로 합칩니다. |
| `bit.withZero` | `boolean` | `false` | 비트 OR 결과가 0이어도 포함합니다. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | 직렬화 전에 값을 변환합니다. |
| `cacheKeyExclude` | `boolean` | `false` | 중복 제거 키에서만 제외하며 query 전송은 유지합니다. |

`bit`는 `{ enable: true, withZero: false }` 형태로 지정합니다.

## Array serialization

| option | 형태 |
| --- | --- |
| `keyFormat: 'brackets'` | `tags[]=red&tags[]=blue` |
| `keyFormat: 'indices'` | `tags[0]=red&tags[1]=blue` |
| `keyFormat: 'one-indices'` | `tags[1]=red&tags[2]=blue` |
| `comma: true` | 쉼표 연결 |
| `separator: ' '`, `separator: '\|'` | 공백·파이프 연결 |

URL의 예약 문자는 percent encoding됩니다. 논리적인 query 값은 화면상의 인코딩 string보다 디코딩한 항목으로 비교합니다.

## Optional fields and transforms

선택 field가 없으면 생략합니다. 빈 string·0·false는 undefined와 다릅니다. `formatters`로 인코딩 전에 string·Date를 변환할 수 있습니다. `cacheKeyExclude: true`는 중복 판단에서만 제외하며 값 전송을 막지 않습니다.

[formatter](./formatters)와 [중복 제거](../method/dedupe)를 참고하세요.
