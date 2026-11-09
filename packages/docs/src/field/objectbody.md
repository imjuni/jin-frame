---
outline: deep
---

# Object bodies

`@ObjectBody()` uses a field value as the body itself, without a wrapper property. Use it for a root-level array, string, number, boolean, or object.

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
| `order` | `number` | `Number.MAX_SAFE_INTEGER` | Merge in ascending order; later properties can overwrite earlier ones. |
| `formatters` | `SingleBodyFormatter \| SingleBodyFormatter[]` | `undefined` | Transform body fields; findFrom selects a nested value. |
| `cacheKeyExcludePaths` | `string[]` | `undefined` | Body paths excluded only from dedupe identity. |
| `encode` | `boolean` | `true` | Retained as field metadata; body assembly does not apply URI encoding. |

## Body shape

The example sends `{ "name": "ironman", "active": true }`, not `{ "payload": ... }`. Use one object-body field per request when possible to make the wire contract clear. Arrays and primitive values require a server body contract that accepts those shapes.

## Multiple sources

`order` sorts object-body fields in ascending order; later merges can overwrite earlier properties. `@Body()` fields also participate in body assembly. Inspect `_request().body` for the combined result when sources overlap.

Formatters operate before merging. `cacheKeyExcludePaths` changes dedupe identity only, and does not redact the transmitted object. Avoid sharing mutable payloads across concurrent requests.
