---
outline: deep
---

# Querystring

In `jin-frame`, when you declare a class field with the `@Query()` decorator, the field value is **serialized into the URL querystring** and included in the request.

## Quick Example

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Query() declare readonly q: string;
  @Query() declare readonly page?: number;
  @Query() declare readonly tags?: string[]; // → ?tags=red&tags=blue
  @Query() declare readonly debug?: boolean; // → ?debug=true
}

// Execute
const frame = SearchFrame.of({ q: 'pikachu', page: 2, tags: ['red', 'blue'], debug: true });
const reply = await frame.execute();

console.log(reply.config.url);
// https://api.example.com/search?q=pikachu&page=2&tags=red&tags=blue&debug=true
```

## Supported Types & Serialization

The types supported by `@Query()` and their URL serialization results are as follows:

<!-- markdownlint-disable MD033 -->

| Type                 | Option  | Example value      | Serialized form                      |
| -------------------- | ------- | ------------------ | ------------------------------------ |
| `string`             |         | `'pikachu'`        | `?q=pikachu`                         |
| `number`             |         | `2`                | `?page=2`                            |
| `boolean`            |         | `true`             | `?debug=true`                        |
| `string[]`           | comma ✗ | `['a','b']`        | `?tags=a&tags=b`                     |
| `string[]`           | comma ✓ | `['a','b']`        | `?tags=a,b`                          |
| `number[]`           | bit ✗   | `[1,2,4]`          | `?ids=1&ids=2&ids=4`                 |
| `number[]`           | bit ✓   | `[1,2,4]`          | `?ids=7`<br />(bitwise OR: 1\|2\|4=7)|
| `undefined` / `null` |         | `undefined`/`null` | **omitted**<br />(query key not created) |

<!-- markdownlint-ensable MD033 -->

- Default array serialization uses **repeated keys**.
- Numbers/booleans are converted to strings before being sent.
- `undefined` / `null` values are automatically omitted.

## Array Options

### Default Array Serialization (Repeated Keys)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayQueryFrame extends JinFrame {
  @Query() declare readonly tags?: string[];
}

const reply = await ArrayQueryFrame.of({ tags: ['red', 'blue'] }).execute();
// → ?tags=red&tags=blue
```

### Comma-separated Arrays

Use the `@Query({ comma: true })` option to serialize arrays as **comma-separated strings**.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaQueryFrame extends JinFrame {
  @Query({ comma: true })
  declare readonly tags?: string[];
}

const reply = await CommaQueryFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → ?tags=red,blue,green
```

### Bitwise OR Arrays (numbers only)

Use `@Query({ bit: { enable: true } })` to serialize numeric arrays as a **bitwise OR sum**.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseQueryFrame extends JinFrame {
  @Query({ bit: { enable: true } })
  declare readonly flags?: number[];
}

const reply = await BitwiseQueryFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7   (1 | 2 | 4 = 7)
```

> Useful when the API expects bitmask values.

### Array Key Formatting

Use the `@Query({ keyFormat: '...' })` option to specify the **key format** for array queries.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class KeyFormatFrame extends JinFrame {
  @Query({ keyFormat: 'brackets' })
  declare readonly tags?: string[];
  
  @Query({ keyFormat: 'indices' })
  declare readonly ids?: number[];
}

const reply = await KeyFormatFrame.of({ 
  tags: ['red', 'blue'], 
  ids: [10, 20] 
}).execute();
// → ?tags[]=red&tags[]=blue&ids[0]=10&ids[1]=20
```

Supported key formats:

- **Default**: `?tags=red&tags=blue` (repeated keys)
- **`brackets`**: `?tags[]=red&tags[]=blue`
- **`indices`**: `?tags[0]=red&tags[1]=blue`
- **`one-indices`**: `?tags[1]=red&tags[2]=blue` (starts from 1)

## URL Encoding

All keys and values are safely **URL encoded** before being added to the URL.

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class EncodedFrame extends JinFrame {
  @Query() declare readonly q: string;
}

const reply = await EncodedFrame.of({ q: 'hello world & tea' }).execute();
// → ?q=hello%20world%20%26%20tea
```

## Optional Queries

If the value is missing, the query key is **omitted**.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class OptionalQueryFrame extends JinFrame {
  @Query() declare readonly q?: string;
  @Query() declare readonly page?: number;
}

const reply = await OptionalQueryFrame.of({}).execute();
// → https://api.example.com/items   (no query)
```

## Combining with Params & Headers

```ts
@Get({ host: 'https://api.example.com', path: '/orgs/:orgId/users' })
export class ListUsersFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Query() declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

const reply = await ListUsersFrame.of({
  orgId: 'acme',
  page: 1,
  Authorization: 'Bearer token',
}).execute();
// → GET /orgs/acme/users?page=1
```

## Debugging Tip

Right before sending the request, you can use `frame.getData('query')` to check the **final query map**.

```ts
const frame = SearchFrame.of({ q: 'pikachu', tags: ['red', 'blue'] });
const req = frame.request();

console.log(frame.getData('query')); // { q: 'pikachu', tags: ['red','blue'] }
console.log(req.url); // final URL
```
