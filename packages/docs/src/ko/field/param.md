---
outline: deep
---

# Path parameters

`@Param()`은 RFC 6570 placeholder에 값을 연결합니다. 경로뿐 아니라 protocol·host·pathPrefix·path 전체에서 사용할 수 있습니다.

## Example

```ts twoslash
import { Get, JinFrame, Param } from 'jin-frame';

@Get({
  host: '{protocol}://{tenant}.api.example.com',
  pathPrefix: '/v{version}',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  // Expand the protocol and hostname placeholders.
  @Param()
  declare readonly protocol: 'http' | 'https';

  @Param()
  declare readonly tenant: string;

  // Expand the shared path prefix.
  @Param()
  declare readonly version: number;

  // Map the local field name to the {id} placeholder.
  @Param({ replaceAt: 'id' })
  declare readonly userId: string;
}

const frame = UserFrame.of({
  protocol: 'https',
  tenant: 'acme',
  version: 2,
  userId: 'alice',
});

// https://acme.api.example.com/v2/users/alice
console.log(frame._request().url);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAt` | `string` | field 이름 | field 이름 대신 사용할 placeholder 이름입니다. |
| `encode` | `boolean` | `true` | 값에 URI 인코딩을 적용합니다. |
| `comma` | `boolean` | `false` | array 요소를 쉼표로 연결합니다. |
| `bit.enable` | `boolean` | `false` | 숫자 array를 비트 OR 값으로 합칩니다. |
| `bit.withZero` | `boolean` | `false` | 비트 OR 결과가 0이어도 포함합니다. |
| `formatters` | `Formatter \| Formatter[]` | — | string 직렬화 전에 값을 변환합니다. |
| `cacheKeyExclude` | `boolean` | `false` | 중복 제거 키에서만 제외하며 URL에는 값을 유지합니다. |

`bit`는 `{ enable: true, withZero: false }` 형태로 지정합니다. formatter 설정은 [formatter](./formatters), URL 조합과 호출별 변경은 [URL 템플릿](../method/url-template)을 참고하세요.
