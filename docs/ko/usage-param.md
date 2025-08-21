---
outline: deep
---

# Param

`jin-frame`에서는 클래스 필드에 `@Param()` 데코레이터를 선언하면, 해당 필드 값이 **URL 경로(path parameter)** 에 바인딩되어 요청에 포함됩니다.

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

`@Param()`이 지원하고, 경로에 직렬화되는 타입:

| Type                 | Option       | Example value      | Serialized form (in path)      |
| -------------------- | ------------ | ------------------ | ------------------------------ |
| `string`             |              | `'alice'`          | `/users/alice`                 |
| `number`             |              | `42`               | `/posts/42`                    |
| `boolean`            |              | `true`             | `/flags/true`                  |
| `string[]`           | comma 옵션 X | `['a','b']`        | `/users/"[\"a\",\"b\"]"`       |
| `string[]`           | comma 옵션 ✓ | `['a','b']`        | `/users/a,b`                   |
| `number[]`           | bit 옵션 X   | `[1,2,4]`          | `/users/"[\"1\",\"2\",\"3\"]"` |
| `number[]`           | bit 옵션 ✓   | `[1,2,4]`          | `/users/7`                     |
| `Date` + formatter   |              | `new Date(...)`    | `/date/2025-08-21`             |
| `undefined` / `null` |              | `undefined`/`null` | **error** (path 불완전)        |

- Path param은 `undefined` 또는 `null`을 허용하지 않습니다. 값이 없으면 **예외 발생**.
- 기본적으로 문자열로 변환 후 URL-safe encoding 처리됩니다.

## Array Options

### 기본 배열 직렬화 (Repeated Headers)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Tags'?: string[];
}

await ArrayHeaderFrame.of({ 'X-Tags': ['red', 'blue'] }).execute();
// → X-Tags: red
// → X-Tags: blue
```

### Comma-separated 배열

`@Header({ comma: true })`를 사용하면 **쉼표 구분**으로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaHeaderFrame extends JinFrame {
  @Header({ comma: true })
  declare readonly 'X-Tags'?: string[];
}

await CommaHeaderFrame.of({ 'X-Tags': ['red', 'blue', 'green'] }).execute();
// → X-Tags: red,blue,green
```

### Bitwise OR 배열 (숫자 전용)

`@Header({ bit: { enable: true } })`는 숫자 배열을 **비트 OR**로 합산해 하나의 숫자로 직렬화합니다.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseHeaderFrame extends JinFrame {
  @Header({ bit: { enable: true } })
  declare readonly 'X-Flags'?: number[];
}

await BitwiseHeaderFrame.of({ 'X-Flags': [1, 2, 4] }).execute();
// → X-Flags: 7   (1 | 2 | 4 = 7)
```

> 서버가 비트 마스크를 받는 API에서 유용합니다.

## Formatters

`@Param()`은 바인딩 전에 값을 가공하는 **formatters** 옵션을 제공합니다.  
처리 순서: **값 수집 → formatters 적용(순차 체인) → 문자열 변환 → URL 인코딩**

> 규칙
>
> - `undefined`/`null` 반환 시 **해당 path param이 누락**되어 오류 발생.
> - `formatters`는 단일 객체 또는 **여러 개의 객체 배열**로 지정 가능.
> - 반환값은 string/number/Date가 권장됩니다.

### 단일 값 포매팅

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

### 숫자 변환 & Date 포매팅

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

### 복수 Formatters (체인 적용)

```ts
@Get({ host: 'https://api.example.com', path: '/events/:date' })
export class ChainParamFrame extends JinFrame {
  @Param({
    formatters: [
      { string: (s: string) => new Date(s) }, // 문자열 → Date
      { dateTime: (d: Date) => Math.floor(d.getTime()) }, // Date → epoch
    ],
  })
  declare readonly date: string;
}

await ChainParamFrame.of({ date: '2025-08-21' }).execute();
// → /events/1755734400000
```

## Param Encoding

모든 파라미터는 URL-safe encoding 처리됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/tags/:tag' })
export class EncodedParamFrame extends JinFrame {
  @Param() declare readonly tag: string;
}

await EncodedParamFrame.of({ tag: 'hello world & tea' }).execute();
// → /tags/hello%20world%20%26%20tea
```

## Optional Param? (불가)

Path param은 기본적으로 **필수 값**입니다. 값이 없으면 URL을 만들 수 없으므로 **예외 발생**합니다.

```ts
@Get({ host: 'https://api.example.com', path: '/items/:id' })
export class OptionalParamFrame extends JinFrame {
  @Param() declare readonly id?: number;
}

await OptionalParamFrame.of({}).execute();
// → Error (id 값 없음)
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

요청 직전에 `frame.getData('param')`로 **최종 path param 맵**을 확인할 수 있습니다.

```ts
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const req = frame.request();

console.log(frame.getData('param')); // { userId: 'alice', postId: 42 }
console.log(req.url); // https://api.example.com/users/alice/posts/42
```
