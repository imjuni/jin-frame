---
outline: deep
---

# Querystring

`jin-frame`에서 클래스 필드에 `@Query()` 데코레이터를 선언하면 해당 필드 값이 **URL 쿼리스트링으로 직렬화**되어 요청에 포함됩니다.

## 간단한 예제

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Query() declare readonly q: string;
  @Query() declare readonly page?: number;
  @Query() declare readonly tags?: string[]; // → ?tags=red&tags=blue
  @Query() declare readonly debug?: boolean; // → ?debug=true
}

// 실행
const frame = SearchFrame.of({ q: 'pikachu', page: 2, tags: ['red', 'blue'], debug: true });
const reply = await frame.execute();

console.log(reply.config.url);
// https://api.example.com/search?q=pikachu&page=2&tags=red&tags=blue&debug=true
```

## 지원 타입과 직렬화 방식

`@Query()`가 지원하는 타입과 URL 직렬화 결과는 다음과 같습니다.

<!-- markdownlint-disable MD033 -->

| 타입                 | 옵션    | 예제 값            | 직렬화 결과                          |
| -------------------- | ------- | ------------------ | ------------------------------------ |
| `string`             |         | `'pikachu'`        | `?q=pikachu`                         |
| `number`             |         | `2`                | `?page=2`                            |
| `boolean`            |         | `true`             | `?debug=true`                        |
| `string[]`           | comma ✗ | `['a','b']`        | `?tags=a&tags=b`                     |
| `string[]`           | comma ✓ | `['a','b']`        | `?tags=a,b`                          |
| `number[]`           | bit ✗   | `[1,2,4]`          | `?ids=1&ids=2&ids=4`                 |
| `number[]`           | bit ✓   | `[1,2,4]`          | `?ids=7`<br />(비트 OR: 1\|2\|4 = 7) |
| `undefined` / `null` |         | `undefined`/`null` | **생략됨**<br />(쿼리 키 생성 안 됨) |

<!-- markdownlint-ensable MD033 -->

- 배열 기본 직렬화는 **반복 키(repeated key)** 방식입니다.
- 숫자/불리언 값은 문자열로 변환되어 전송됩니다.
- `undefined` / `null`은 자동으로 생략됩니다.

## 배열 옵션

### 기본 배열 직렬화 (반복 키)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayQueryFrame extends JinFrame {
  @Query() declare readonly tags?: string[];
}

const reply = await ArrayQueryFrame.of({ tags: ['red', 'blue'] }).execute();
// → ?tags=red&tags=blue
```

### 쉼표 구분 배열

`@Query({ comma: true })` 옵션을 사용하면 배열을 **쉼표 구분 문자열**로 직렬화할 수 있습니다.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaQueryFrame extends JinFrame {
  @Query({ comma: true })
  declare readonly tags?: string[];
}

const reply = await CommaQueryFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → ?tags=red,blue,green
```

### 비트 OR 배열 (숫자 전용)

`@Query({ bit: { enable: true } })`를 사용하면 숫자 배열을 **비트 OR 합산 값**으로 직렬화할 수 있습니다.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseQueryFrame extends JinFrame {
  @Query({ bit: { enable: true } })
  declare readonly flags?: number[];
}

const reply = await BitwiseQueryFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7   (1 | 2 | 4 = 7)
```

> API 서버가 비트 마스크 값을 기대할 때 유용합니다.

## URL 인코딩

모든 키와 값은 URL에 추가되기 전에 안전하게 **URL 인코딩**됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class EncodedFrame extends JinFrame {
  @Query() declare readonly q: string;
}

const reply = await EncodedFrame.of({ q: 'hello world & tea' }).execute();
// → ?q=hello%20world%20%26%20tea
```

## 선택적 쿼리

값이 없으면 해당 쿼리 키는 **생략**됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class OptionalQueryFrame extends JinFrame {
  @Query() declare readonly q?: string;
  @Query() declare readonly page?: number;
}

const reply = await OptionalQueryFrame.of({}).execute();
// → https://api.example.com/items   (쿼리 없음)
```

## Param, Header와 함께 사용하기

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

## 디버깅 팁

요청 직전에 `frame.getData('query')`를 사용해 최종 쿼리 맵을 확인할 수 있습니다.

```ts
const frame = SearchFrame.of({ q: 'pikachu', tags: ['red', 'blue'] });
const req = frame.request();

console.log(frame.getData('query')); // { q: 'pikachu', tags: ['red','blue'] }
console.log(req.url); // 최종 URL
```
