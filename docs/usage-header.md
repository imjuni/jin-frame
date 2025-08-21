---
outline: deep
---

# Header

In `jin-frame`, when you declare a class field with the `@Header()` decorator, the field value is **serialized into an HTTP header** and included in the request.

## Quick Example

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Header() declare readonly Authorization: string;
  @Header() declare readonly 'X-Tracking-Id'?: string;
  @Header() declare readonly 'X-Tags'?: string[];   // → X-Tags: red  (repeat)  X-Tags: blue
  @Header() declare readonly 'X-Debug'?: boolean;   // → X-Debug: true
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

Types supported by `@Header()` and their serialized forms:

| Type                 | Option       | Example value      | Serialized form (header lines)                |
| -------------------- | ------------ | ------------------ | -------------------------------------------- |
| `string`             |              | `'token'`          | `X-Auth: token`                               |
| `number`             |              | `2`                | `X-Page: 2`                                   |
| `boolean`            |              | `true`             | `X-Debug: true`                               |
| `string[]`           | comma ✗      | `['a','b']`        | `X-Tags: a`<br>`X-Tags: b`                    |
| `string[]`           | comma ✓      | `['a','b']`        | `X-Tags: a,b`                                 |
| `number[]`           | bit ✗        | `[1,2,4]`          | `X-Flags: 1`<br>`X-Flags: 2`<br>`X-Flags: 4`  |
| `number[]`           | bit ✓        | `[1,2,4]`          | `X-Flags: 7` (bitwise OR: 1\|2\|4 = 7)        |
| `undefined` / `null` |              | `undefined`/`null` | **omitted** (header not created)              |

- **Default array serialization** uses **repeated headers**.  
- Numbers/booleans are converted to strings.  
- `undefined`/`null` values are **automatically omitted**.  

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

Use `@Header({ comma: true })` to serialize arrays with **comma separation**.

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

## Formatters

`@Header()` provides the **formatters** option to process values before serialization.  
Processing order: **collect value → apply formatters (sequential chain) → array serialization (comma/bit) → string conversion**

> Rules
>
> - Returning `undefined` or `null` skips the header key.  
> - For array fields, formatters apply **to each element**.  
> - `formatters` can be a single object or **an array of objects** applied sequentially.  
> - Return values should be primitives (string/number/boolean) or arrays.  
> - Allows chained conversions like **string → Date → epoch time**.  

### Single Value Formatting

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class FormatterSingleHeaderFrame extends JinFrame {
  @Header({
    // Trim and lowercase
    formatters: { string: (v: string) => v.trim().toLowerCase() },
  })
  declare readonly 'X-Keyword'?: string;

  @Header({
    // Round to 2 decimal places
    formatters: { number: (v: number) => Number(v.toFixed(2)) },
  })
  declare readonly 'X-Price'?: number;

  @Header({
    // Date → YYYY-MM-DD
    formatters: {
      dateTime: (d?: Date) =>
        d == null
          ? undefined
          : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    },
  })
  declare readonly 'X-Date'?: Date;
}

await FormatterSingleHeaderFrame.of({
  'X-Keyword': '  Pikachu ',
  'X-Price': 12.345,
  'X-Date': new Date('2025-08-21'),
}).execute();
// → X-Keyword: pikachu
// → X-Price: 12.35
// → X-Date: 2025-08-21
```

### Array Element Formatting (per element)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterArrayHeaderFrame extends JinFrame {
  @Header({
    formatters: { string: (tag: string) => tag.trim().toLowerCase() },
  })
  declare readonly 'X-Tags'?: string[];
}

await FormatterArrayHeaderFrame.of({ 'X-Tags': ['  RED ', '  Blue'] }).execute();
// → X-Tags: red
// → X-Tags: blue
```

### Multiple Formatters (chained)

```ts
@Get({ host: 'https://api.example.com', path: '/convert' })
export class FormatterChainHeaderFrame extends JinFrame {
  @Header({
    formatters: [
      { string: (s: string) => s.trim() },
      { string: (s: string) => new Date(s) },            // string → Date
      { dateTime: (d: Date) => Math.floor(d.getTime()) } // Date → epoch time
    ],
  })
  declare readonly 'X-Dates'?: string[];
}

await FormatterChainHeaderFrame.of({ 'X-Dates': ['2025-08-01', '2025-08-02'] }).execute();
// → X-Dates: 1754006400000
// → X-Dates: 1754092800000
```

### Arrays + Comma Serialization

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterCommaHeaderFrame extends JinFrame {
  @Header({
    comma: true,
    formatters: { string: (tag: string) => `c-${tag.trim()}` }, // applied per element
  })
  declare readonly 'X-Tags'?: string[];
}

await FormatterCommaHeaderFrame.of({ 'X-Tags': ['red', ' blue ', 'green,'] }).execute();
// → X-Tags: c-red,c-blue,c-green
```

### Number Arrays + Bitwise OR (element normalization)

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class FormatterBitHeaderFrame extends JinFrame {
  @Header({
    bit: { enable: true },
    formatters: { number: (f?: number) => (Number.isFinite(f) && f! >= 0 ? Number(f) : undefined) },
  })
  declare readonly 'X-Flags'?: number[];
}

await FormatterBitHeaderFrame.of({ 'X-Flags': [1, 2, 4] }).execute();
// → X-Flags: 7
```

### Mapping / Enum Conversion

```ts
const TAG_MAP: Record<string, string> = { red: 'R', blue: 'B', green: 'G' };

@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterMapHeaderFrame extends JinFrame {
  @Header({
    formatters: { string: (tag?: string) => (tag ? TAG_MAP[tag] : undefined) },
  })
  declare readonly 'X-Tags'?: string[];
}

await FormatterMapHeaderFrame.of({ 'X-Tags': ['red', 'blue', 'green'] }).execute();
// → X-Tags: R
// → X-Tags: B
// → X-Tags: G
```

> Tip: By chaining **element-level → intermediate → final transformations**, you can handle complex type mappings smoothly.

## Header Value Encoding

Unlike query strings, header values are **not percent-encoded**.  
All values are converted to **strings** (with formatters if needed) and sent as-is.

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
  @Param()  declare readonly orgId: string;
  @Query()  declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

await ListUsersHeaderFrame.of({ orgId: 'acme', page: 1, Authorization: 'Bearer token' }).execute();
// → GET /orgs/acme/users?page=1
// → Authorization: Bearer token
```

---

## Debugging Tip

Right before sending the request, you can inspect the **final header map** using `frame.getData('header')`.

```ts
const frame = SearchFrame.of({
  Authorization: 'Bearer token',
  'X-Tags': ['red', 'blue'],
});
const req = frame.request();

console.log(frame.getData('header')); // { Authorization: 'Bearer token', 'X-Tags': ['red','blue'] } (raw before serialization)
console.log(req.headers);             // serialized & flattened headers
```
