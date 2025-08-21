---
outline: deep
---

# Param

In `jin-frame`, when you declare a class field with the `@Param()` decorator, the field value is **bound to the URL path parameter** and included in the request.

## Quick Example

```ts
@Get({ host: 'https://api.example.com', path: '/users/:userId/posts/:postId' })
export class UserPostFrame extends JinFrame {
  @Param() declare readonly userId: string;
  @Param() declare readonly postId: number;
}

// Execute
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const reply = await frame.execute();

// Final URL:
// https://api.example.com/users/alice/posts/42
```

## Supported Types & Serialization

Types supported by `@Param()` and how they are serialized into the path:

| Type                 | Option       | Example value      | Serialized form (in path)      |
| -------------------- | ------------ | ------------------ | ------------------------------ |
| `string`             |              | `'alice'`          | `/users/alice`                 |
| `number`             |              | `42`               | `/posts/42`                    |
| `boolean`            |              | `true`             | `/flags/true`                  |
| `string[]`           | comma ✗      | `['a','b']`        | `/users/"[\"a\",\"b\"]"`       |
| `string[]`           | comma ✓      | `['a','b']`        | `/users/a,b`                   |
| `number[]`           | bit ✗        | `[1,2,4]`          | `/users/"[\"1\",\"2\",\"3\"]"` |
| `number[]`           | bit ✓        | `[1,2,4]`          | `/users/7`                     |
| `Date` + formatter   |              | `new Date(...)`    | `/date/2025-08-21`             |
| `undefined` / `null` |              | `undefined`/`null` | **error** (incomplete path)    |

- Path params do not allow `undefined` or `null`. Missing values will **throw an exception**.  
- By default, values are converted to strings and URL-safe encoded.  

## Array Options

### Default Array Serialization (Raw Arrays)

Arrays without options are serialized as JSON-like strings.

```ts
@Get({ host: 'https://api.example.com', path: '/users/:tags' })
export class ArrayParamFrame extends JinFrame {
  @Param() declare readonly tags?: string[];
}

await ArrayParamFrame.of({ tags: ['red', 'blue'] }).execute();
// → /users/"[\"red\",\"blue\"]"
```

### Comma-separated Arrays

Use `@Param({ comma: true })` to serialize arrays as **comma-separated values**.

```ts
@Get({ host: 'https://api.example.com', path: '/users/:tags' })
export class CommaParamFrame extends JinFrame {
  @Param({ comma: true })
  declare readonly tags?: string[];
}

await CommaParamFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → /users/red,blue,green
```

### Bitwise OR Arrays (numbers only)

Use `@Param({ bit: { enable: true } })` to serialize numeric arrays as a **bitwise OR sum**.

```ts
@Get({ host: 'https://api.example.com', path: '/flags/:flags' })
export class BitwiseParamFrame extends JinFrame {
  @Param({ bit: { enable: true } })
  declare readonly flags?: number[];
}

await BitwiseParamFrame.of({ flags: [1, 2, 4] }).execute();
// → /flags/7   (1 | 2 | 4 = 7)
```

> Useful when the API expects bitmask values.

## Formatters

`@Param()` provides the **formatters** option to process values before binding.  
Processing order: **collect value → apply formatters (sequential chain) → string conversion → URL encoding**

> Rules
>
> - Returning `undefined` or `null` causes the param to be missing, which results in an **error**.  
> - `formatters` can be a single object or an **array of objects** applied sequentially.  
> - Recommended return values are string/number/Date.  

### Single Value Formatting

```ts
@Get({ host: 'https://api.example.com', path: '/users/:userId' })
export class FormatterParamFrame extends JinFrame {
  @Param({
    formatters: { string: (v: string) => v.trim().toLowerCase() },
  })
  declare readonly userId: string;
}

await FormatterParamFrame.of({ userId: '  Alice ' }).execute();
// → /users/alice
```

### Numeric & Date Formatting

```ts
@Get({ host: 'https://api.example.com', path: '/reports/:year/:date' })
export class ReportParamFrame extends JinFrame {
  @Param({
    formatters: { number: (n: number) => Math.floor(n) },
  })
  declare readonly year: number;

  @Param({
    formatters: {
      dateTime: (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    },
  })
  declare readonly date: Date;
}

await ReportParamFrame.of({ year: 2025.9, date: new Date('2025-08-21') }).execute();
// → /reports/2025/2025-08-21
```

### Multiple Formatters (chained)

```ts
@Get({ host: 'https://api.example.com', path: '/events/:date' })
export class ChainParamFrame extends JinFrame {
  @Param({
    formatters: [
      { string: (s: string) => new Date(s) },           // string → Date
      { dateTime: (d: Date) => Math.floor(d.getTime()) } // Date → epoch
    ],
  })
  declare readonly date: string;
}

await ChainParamFrame.of({ date: '2025-08-21' }).execute();
// → /events/1755734400000
```

## Param Encoding

All param values are URL-safe encoded.

```ts
@Get({ host: 'https://api.example.com', path: '/tags/:tag' })
export class EncodedParamFrame extends JinFrame {
  @Param() declare readonly tag: string;
}

await EncodedParamFrame.of({ tag: 'hello world & tea' }).execute();
// → /tags/hello%20world%20%26%20tea
```

## Optional Params? (Not allowed)

Path params are always **required**. Missing values will result in an **error** because the URL cannot be built.

```ts
@Get({ host: 'https://api.example.com', path: '/items/:id' })
export class OptionalParamFrame extends JinFrame {
  @Param() declare readonly id?: number;
}

await OptionalParamFrame.of({}).execute();
// → Error (missing id)
```

## Combining with Query & Header

```ts
@Get({ host: 'https://api.example.com', path: '/orgs/:orgId/users/:userId' })
export class ListUsersParamFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Param() declare readonly userId: string;
  @Query() declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

await ListUsersParamFrame.of({ orgId: 'acme', userId: 'alice', page: 1, Authorization: 'Bearer token' }).execute();
// → GET /orgs/acme/users/alice?page=1
// → Authorization: Bearer token
```

---

## Debugging Tip

Right before sending the request, you can check the **final param map** with `frame.getData('param')`.

```ts
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const req = frame.request();

console.log(frame.getData('param')); // { userId: 'alice', postId: 42 }
console.log(req.url); // https://api.example.com/users/alice/posts/42
```
