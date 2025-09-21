---
outline: deep
---

# Header

`jin-frame`에서 클래스 필드에 `@Header()` 데코레이터를 선언하면, 해당 필드 값이 **HTTP 헤더로 직렬화**되어 요청에 포함됩니다.

## 간단한 예제

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Header() declare readonly Authorization: string;
  @Header() declare readonly 'X-Tracking-Id'?: string;
  @Header() declare readonly 'X-Tags'?: string[]; // → X-Tags: red (반복)  X-Tags: blue
  @Header() declare readonly 'X-Debug'?: boolean; // → X-Debug: true
}

// 실행
const frame = SearchFrame.of({
  Authorization: 'Bearer token',
  'X-Tracking-Id': '1234',
  'X-Tags': ['red', 'blue'],
  'X-Debug': true,
});
const reply = await frame.execute();

// 전송된 헤더:
// Authorization: Bearer token
// X-Tracking-Id: 1234
// X-Tags: red
// X-Tags: blue
// X-Debug: true
```

## 지원 타입과 직렬화 방식

`@Header()`가 지원하는 타입과 직렬화 결과는 다음과 같습니다.

<!-- markdownlint-disable MD033 -->

| 타입                 | 옵션    | 예제 값            | 직렬화 결과 (헤더 라인)                  |
| -------------------- | ------- | ------------------ | ---------------------------------------- |
| `string`             |         | `'token'`          | `X-Auth: token`                          |
| `number`             |         | `2`                | `X-Page: 2`                              |
| `boolean`            |         | `true`             | `X-Debug: true`                          |
| `string[]`           | comma ✗ | `['a','b']`        | `X-Tags: "[\"a\", \"b\"]"`               |
| `string[]`           | comma ✓ | `['a','b']`        | `X-Tags: a,b`                            |
| `number[]`           | bit ✗   | `[1,2,4]`          | `X-Flags: "[\"1\", \"2\", \"4\"]"`       |
| `number[]`           | bit ✓   | `[1,2,4]`          | `X-Flags: 7`<br />(비트 OR: 1\|2\|4 = 7) |
| `undefined` / `null` |         | `undefined`/`null` | **생략됨** (헤더 생성 안 됨)             |

<!-- markdownlint-ensable MD033 -->

- 배열 기본 직렬화는 **반복 헤더** 방식입니다.
- 숫자/불리언은 문자열로 변환되어 전송됩니다.
- `undefined` / `null` 값은 자동으로 생략됩니다.

## 배열 옵션

### 기본 배열 직렬화 (반복 헤더)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Tags'?: string[];
}

await ArrayHeaderFrame.of({ 'X-Tags': ['red', 'blue'] }).execute();
// → X-Tags: red
// → X-Tags: blue
```

### 쉼표 구분 배열

`@Header({ comma: true })`를 사용하면 배열이 **쉼표 구분 문자열**로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaHeaderFrame extends JinFrame {
  @Header({ comma: true })
  declare readonly 'X-Tags'?: string[];
}

await CommaHeaderFrame.of({ 'X-Tags': ['red', 'blue', 'green'] }).execute();
// → X-Tags: red,blue,green
```

### 비트 OR 배열 (숫자 전용)

`@Header({ bit: { enable: true } })`를 사용하면 숫자 배열이 **비트 OR 합산 값**으로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseHeaderFrame extends JinFrame {
  @Header({ bit: { enable: true } })
  declare readonly 'X-Flags'?: number[];
}

await BitwiseHeaderFrame.of({ 'X-Flags': [1, 2, 4] }).execute();
// → X-Flags: 7   (1 | 2 | 4 = 7)
```

> API 서버가 비트 마스크 값을 요구할 때 유용합니다.

## 헤더 값 인코딩

쿼리스트링과 달리 헤더 값은 **퍼센트 인코딩되지 않습니다**.  
모든 값은 문자열(필요 시 formatter 적용)로 변환되어 그대로 전송됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class EncodedHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Note': string;
}

await EncodedHeaderFrame.of({ 'X-Note': 'hello & tea' }).execute();
// → X-Note: hello & tea
```

## 선택적 헤더

값이 없으면 해당 헤더는 **생성되지 않습니다**.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class OptionalHeaderFrame extends JinFrame {
  @Header() declare readonly 'X-Trace'?: string;
  @Header() declare readonly 'X-Page'?: number;
}

await OptionalHeaderFrame.of({}).execute();
// → X-Trace, X-Page 헤더 없음
```

## Param, Query와 함께 사용하기

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

## 디버깅 팁

요청 직전에 `frame.getData('header')`를 사용해 **최종 헤더 맵**을 확인할 수 있습니다.

```ts
const frame = SearchFrame.of({
  Authorization: 'Bearer token',
  'X-Tags': ['red', 'blue'],
});
const req = frame.request();

console.log(frame.getData('header')); // { Authorization: 'Bearer token', 'X-Tags': ['red','blue'] } (직렬화 전 원본)
console.log(req.headers); // 직렬화된 최종 헤더
```
