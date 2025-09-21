---
outline: deep
---

# Param

`jin-frame`에서 클래스 필드에 `@Param()` 데코레이터를 선언하면, 해당 필드 값이 **URL 경로 파라미터(Path Parameter)**로 바인딩되어 요청에 포함됩니다.

## 간단한 예제

```ts
@Get({ host: 'https://api.example.com', path: '/users/:userId/posts/:postId' })
export class UserPostFrame extends JinFrame {
  @Param() declare readonly userId: string;
  @Param() declare readonly postId: number;
}

// 실행
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const reply = await frame.execute();

// 최종 URL:
// https://api.example.com/users/alice/posts/42
```

## 지원 타입과 직렬화 방식

`@Param()`이 지원하는 타입과 직렬화 결과는 다음과 같습니다.

| 타입                  | 옵션    | 예제 값           | 직렬화 결과 (경로 내)          |
| --------------------- | ------- | ----------------- | ------------------------------ |
| `string`              |         | `'alice'`         | `/users/alice`                 |
| `number`              |         | `42`              | `/posts/42`                    |
| `boolean`             |         | `true`            | `/flags/true`                  |
| `string[]`            | comma ✗ | `['a','b']`       | `/users/"[\"a\",\"b\"]"`       |
| `string[]`            | comma ✓ | `['a','b']`       | `/users/a,b`                   |
| `number[]`            | bit ✗   | `[1,2,4]`         | `/users/"[\"1\",\"2\",\"3\"]"` |
| `number[]`            | bit ✓   | `[1,2,4]`         | `/users/7`                     |
| `Date` + formatter    |         | `new Date(...)`   | `/date/2025-08-21`             |
| `undefined` / `null`  |         | `undefined`/`null`| **에러** (경로 불완전)         |

- Path Param은 `undefined` 또는 `null` 값을 허용하지 않습니다. 값이 없으면 **예외가 발생**합니다.  
- 기본적으로 모든 값은 문자열로 변환되고 URL-safe 인코딩됩니다.

## 배열 옵션

### 기본 배열 직렬화 (Raw 배열)

옵션이 없는 배열은 JSON 문자열처럼 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/users/:tags' })
export class ArrayParamFrame extends JinFrame {
  @Param() declare readonly tags?: string[];
}

await ArrayParamFrame.of({ tags: ['red', 'blue'] }).execute();
// → /users/"[\"red\",\"blue\"]"
```

### 쉼표 구분 배열

`@Param({ comma: true })`를 사용하면 배열이 **쉼표 구분 문자열**로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/users/:tags' })
export class CommaParamFrame extends JinFrame {
  @Param({ comma: true })
  declare readonly tags?: string[];
}

await CommaParamFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → /users/red,blue,green
```

### 비트 OR 배열 (숫자 전용)

`@Param({ bit: { enable: true } })`를 사용하면 숫자 배열이 **비트 OR 합산 값**으로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/flags/:flags' })
export class BitwiseParamFrame extends JinFrame {
  @Param({ bit: { enable: true } })
  declare readonly flags?: number[];
}

await BitwiseParamFrame.of({ flags: [1, 2, 4] }).execute();
// → /flags/7   (1 | 2 | 4 = 7)
```

> API 서버가 비트 마스크 값을 요구할 때 유용합니다.

## Param 인코딩

모든 파라미터 값은 URL-safe 인코딩됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/tags/:tag' })
export class EncodedParamFrame extends JinFrame {
  @Param() declare readonly tag: string;
}

await EncodedParamFrame.of({ tag: 'hello world & tea' }).execute();
// → /tags/hello%20world%20%26%20tea
```

## Optional Param? (허용되지 않음)

경로 파라미터는 항상 **필수 값**입니다. 값이 없으면 URL을 만들 수 없으므로 **에러**가 발생합니다.

```ts
@Get({ host: 'https://api.example.com', path: '/items/:id' })
export class OptionalParamFrame extends JinFrame {
  @Param() declare readonly id?: number;
}

await OptionalParamFrame.of({}).execute();
// → Error (id 누락)
```

## Query, Header와 함께 사용하기

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
  Authorization: 'Bearer token'
}).execute();
// → GET /orgs/acme/users/alice?page=1
// → Authorization: Bearer token
```

## 디버깅 팁

요청 직전에 `frame.getData('param')`을 사용해 **최종 Param 맵**을 확인할 수 있습니다.

```ts
const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
const req = frame.request();

console.log(frame.getData('param')); // { userId: 'alice', postId: 42 }
console.log(req.url); // https://api.example.com/users/alice/posts/42
```
