---
outline: deep
---

# Header

When you declare a class field with the `@Header()` decorator in `jin-frame`, the field value is **serialized into an HTTP header** and included in the request.

## Quick Example

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Header() declare readonly Authorization: string;
  @Header() declare readonly 'X-Tracking-Id'?: string;
  @Header() declare readonly 'X-Tags'?: string[]; // → X-Tags: red (repeat)  X-Tags: blue
  @Header() declare readonly 'X-Debug'?: boolean; // → X-Debug: true
}

// Execute
const frame = SearchFrame.of({
  Authorization: 'Bearer token',
  'X-Tracking-Id': '1234',
  'X-Tags': ['red', 'blue'],
  'X-Debug': true,
});
const reply = await frame.execute();

// Sent headers:
// Authorization: Bearer token
// X-Tracking-Id: 1234
// X-Tags: red
// X-Tags: blue
// X-Debug: true
```

## Supported Types & Serialization

`@Header()` supports the following types and serializes them as shown:

<!-- markdownlint-disable MD033 -->

| Type                 | Option  | Example value      | Serialized form (header line)               |
| -------------------- | ------- | ------------------ | ------------------------------------------- |
| `string`             |         | `'token'`          | `X-Auth: token`                             |
| `number`             |         | `2`                | `X-Page: 2`                                 |
| `boolean`            |         | `true`             | `X-Debug: true`                             |
| `string[]`           | comma ✗ | `['a','b']`        | `X-Tags: "[\"a\", \"b\"]"`                  |
| `string[]`           | comma ✓ | `['a','b']`        | `X-Tags: a,b`                               |
| `number[]`           | bit ✗   | `[1,2,4]`          | `X-Flags: "[\"1\", \"2\", \"4\"]"`          |
| `number[]`           | bit ✓   | `[1,2,4]`          | `X-Flags: 7`<br />(bitwise OR: 1\|2\|4 = 7) |
| `undefined` / `null` |         | `undefined`/`null` | **omitted** (header not created)            |

<!-- markdownlint-enable MD033 -->

- The default array serialization is **repeated headers**.
- Numbers and booleans are converted to strings.
- `undefined` / `null` values are automatically omitted.

## Array Options

### Default Array Serialization (Repeated Headers)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Tags'?: string[];
}

await ArrayHeaderFrame.of({ 'X-Tags': ['red', 'blue'] }).execute();
// → X-Tags: red
// → X-Tags: blue
```

### Comma-separated Arrays

Use `@Header({ comma: true })` to serialize arrays as a **comma-separated string**.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaHeaderFrame extends JinFrame {
  @Header({ comma: true })
  declare readonly 'X-Tags'?: string[];
}

await CommaHeaderFrame.of({ 'X-Tags': ['red', 'blue', 'green'] }).execute();
// → X-Tags: red,blue,green
```

### Bitwise OR Arrays (numbers only)

Use `@Header({ bit: { enable: true } })` to serialize numeric arrays as a **bitwise OR sum**.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseHeaderFrame extends JinFrame {
  @Header({ bit: { enable: true } })
  declare readonly 'X-Flags'?: number[];
}

await BitwiseHeaderFrame.of({ 'X-Flags': [1, 2, 4] }).execute();
// → X-Flags: 7   (1 | 2 | 4 = 7)
```

> Useful when the API expects bitmask values.

## Header Value Encoding

Unlike query strings, header values are **not percent-encoded**. All values are converted to **strings** (with formatters if needed) and sent as-is.

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class EncodedHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Note': string;
}

await EncodedHeaderFrame.of({ 'X-Note': 'hello & tea' }).execute();
// → X-Note: hello & tea
```

## Optional Headers

If no value is provided, the header itself is **omitted**.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class OptionalHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Trace'?: string;
  @Header() declare readonly 'X-Page'?: number;
}

await OptionalHeaderFrame.of({}).execute();
// → no X-Trace / X-Page headers
```

## Combining with Params & Query

```ts
@Get({ host: 'https://api.example.com', path: '/orgs/:orgId/users' })
export class ListUsersHeaderFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Query() declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

await ListUsersHeaderFrame.of({
  orgId: 'acme',
  page: 1,
  Authorization: 'Bearer token',
}).execute();
// → GET /orgs/acme/users?page=1
// → Authorization: Bearer token
```

## Debugging Tip

Right before sending the request, you can check the **final header map** using `frame.getData('header')`.

```ts
const frame = SearchFrame.of({
  Authorization: 'Bearer token',
  'X-Tags': ['red', 'blue'],
});
const req = frame.request();

console.log(frame.getData('header')); // { Authorization: 'Bearer token', 'X-Tags': ['red','blue'] } (raw before serialization)
console.log(req.headers); // serialized & flattened headers
```
