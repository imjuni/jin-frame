---
outline: deep
---

# Query parameters

`@Query()` adds field values to the URL query string. Use `replaceAt` to separate TypeScript names from wire names, and choose array serialization to match the server.

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
| `replaceAt` | `string` | Field name | Query parameter name sent to the server. |
| `encode` | `boolean` | `true` | Apply URI encoding to query values. |
| `comma` | `boolean` | `false` | Join array values with commas. |
| `separator` | `',' \| ' ' \| '\|'` | `undefined` | Array separator; takes precedence over comma. |
| `keyFormat` | `'brackets' \| 'indices' \| 'one-indices'` | `undefined` | Array key format; unspecified repeats the unmodified key. |
| `bit.enable` | `boolean` | `false` | Combine numeric arrays using bitwise OR. |
| `bit.withZero` | `boolean` | `false` | Include a bitwise result even when it is zero. |
| `formatters` | `Formatter \| Formatter[]` | `undefined` | Transform values before serialization. |
| `cacheKeyExclude` | `boolean` | `false` | Exclude from dedupe identity without omitting transmission. |

Configure `bit` as `{ enable: true, withZero: false }`.

## Array serialization

| Option | Shape |
| --- | --- |
| `keyFormat: 'brackets'` | `tags[]=red&tags[]=blue` |
| `keyFormat: 'indices'` | `tags[0]=red&tags[1]=blue` |
| `keyFormat: 'one-indices'` | `tags[1]=red&tags[2]=blue` |
| `comma: true` | Comma-joined values. |
| `separator: ' '`, `separator: '\|'` | Space- or pipe-joined values. |

URL text percent-encodes reserved characters. Inspect decoded query entries when comparing logical values instead of relying on display encoding.

## Optional fields and transforms

Absent optional fields are omitted. Empty string, zero, and false are values; do not assume they behave like undefined. `formatters` can normalize strings or format Dates before encoding. `cacheKeyExclude: true` affects deduplication identity, not whether a value is transmitted.

See [formatters](./formatters) and [deduplication](../method/dedupe).
