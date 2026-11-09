---
outline: deep
---

# Body fields

`@Body()` assembles request bodies from individual fields. JSON is the default body format. Unlike `replaceAt` for headers and queries, body replacement paths can describe nested properties.

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
| `replaceAt` | `string` | Field name | Destination property or dotted body path. |
| `formatters` | `SingleBodyFormatter \| SingleBodyFormatter[]` | `undefined` | Transform body fields; findFrom selects a nested value. |
| `cacheKeyExcludePaths` | `string[]` | `undefined` | Body paths excluded only from dedupe identity. |
| `encode` | `boolean` | `true` | Retained as field metadata; body assembly does not apply URI encoding. |

## Serialization

jin-frame first assembles the decorated fields into an object, then calls `JSON.stringify()` to prepare the JSON body for fetch. `_request().body` contains this serialized string, as shown in the console output above.

`@Body()` always places a value under its field name (or `replaceAt` path). Use [`@ObjectBody()`](./objectbody) to send a value as the body itself, including an array, string, number, or boolean.

The table shows the serialized JSON when the field is named `payload`:

| Value | `@Body()` | `@ObjectBody()` |
| --- | --- | --- |
| `['a', 'b']` | `{"payload":["a","b"]}` | `["a","b"]` |
| `'ironman'` | `{"payload":"ironman"}` | `"ironman"` |
| `42` | `{"payload":42}` | `42` |
| `true` | `{"payload":true}` | `true` |

## Transformations and identity

Body formatters support typed primitive handlers and object-path selection. They run before body serialization. `cacheKeyExcludePaths` changes dedupe identity without removing fields from the actual request. Exclude only values that are irrelevant to response identity.

See [object bodies](./objectbody), [formatters](./formatters), and [forms](../method/form).
