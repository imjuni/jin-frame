---
outline: deep
---

# Param

In **`jin-frame`**, when you declare a class field with the `@Param()` decorator, the field value is **bound to the URL path parameter** and included in the request.

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

The types supported by `@Param()` and their serialized results are as follows:

| Type                 | Option  | Example Value      | Serialized Result (in Path)    |
| -------------------- | ------- | ------------------ | ------------------------------ |
| `string`             |         | `'alice'`          | `/users/alice`                 |
| `number`             |         | `42`               | `/posts/42`                    |
| `boolean`            |         | `true`             | `/flags/true`                  |
| `string[]`           | comma ✗ | `['a','b']`        | `/users/"[\"a\",\"b\"]"`       |
| `string[]`           | comma ✓ | `['a','b']`        | `/users/a,b`                   |
| `number[]`           | bit ✗   | `[1,2,4]`          | `/users/"[\"1\",\"2\",\"3\"]"` |
| `number[]`           | bit ✓   | `[1,2,4]`          | `/users/7`                     |
| `Date` + formatter   |         | `new Date(...)`    | `/date/2025-08-21`             |
| `undefined` / `null` |         | `undefined`/`null` | **Error** (incomplete path)    |

- Path parameters do **not** allow `undefined` or `null`. If a value is missing, an **exception will be thrown**.
- By default, all values are converted to strings and URL-safe encoded.

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

### Comma-Separated Arrays

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

### Bitwise OR Arrays (Numbers Only)

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

## Optional Params? (Not Allowed)

Path parameters are always **required**. Missing values result in an **error** because the URL cannot be built.

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

await ListUsersParamFrame.of({
  orgId: 'acme',
  userId: 'alice',
  page: 1,
  Authorization: 'Bearer token',
}).execute();
// → GET /orgs/acme/users/alice?page=1
// → Authorization: Bearer token
```

## Debugging Tip

Right before sending the request, you can check the **final param map** with `frame.getData('param')`.

```ts
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const req = frame.request();

console.log(frame.getData('param')); // { userId: 'alice', postId: 42 }
console.log(req.url); // https://api.example.com/users/alice/posts/42
```
