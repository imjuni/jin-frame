---
outline: deep
---

# Path parameters

`@Param()` supplies values for RFC 6570 placeholders throughout the URL: protocol, host, path prefix, and path.

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
| `replaceAt` | `string` | Field name | Placeholder name when it differs from the field name. |
| `encode` | `boolean` | `true` | Apply URI encoding to the value. |
| `comma` | `boolean` | `false` | Join array elements with commas. |
| `bit.enable` | `boolean` | `false` | Combine a numeric array using bitwise OR. |
| `bit.withZero` | `boolean` | `false` | Include a bitwise result even when it is zero. |
| `formatters` | `Formatter \| Formatter[]` | — | Transform values before string serialization. |
| `cacheKeyExclude` | `boolean` | `false` | Exclude from dedupe identity while retaining the value in the URL. |

Configure `bit` as `{ enable: true, withZero: false }`. See [formatters](./formatters) for transformations and [URL templates](../method/url-template) for composition and call-level overrides.
