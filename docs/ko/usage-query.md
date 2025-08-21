---
outline: deep
---

# Querystring

`jin-frame`에서는 클래스 필드에 `@Query()` 데코레이터를 선언하면, 해당 필드 값이 **URL의 쿼리스트링**으로 직렬화되어 요청에 포함됩니다.

> ✅ 변경 사항: 이전 버전의 `@JinFrame.query`는 이제 **`@Query`**로 대체되었습니다.

---

## Quick Example

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class SearchFrame extends JinFrame {
  @Query() declare readonly q: string;
  @Query() declare readonly page?: number;
  @Query() declare readonly tags?: string[];   // → ?tags=red&tags=blue
  @Query() declare readonly debug?: boolean;   // → ?debug=true
}

// Execute
const frame = SearchFrame.of({ q: 'pikachu', page: 2, tags: ['red', 'blue'], debug: true });
const reply = await frame.execute();

console.log(reply.config.url);
// https://api.example.com/search?q=pikachu&page=2&tags=red&tags=blue&debug=true
```

---

## Supported Types & Serialization

`@Query()`가 지원하고, URL로 직렬화되는 타입:

| Type                     | Example value       | Serialized form                         |
|--------------------------|---------------------|-----------------------------------------|
| `string`                 | `'pikachu'`         | `?q=pikachu`                            |
| `number`                 | `2`                 | `?page=2`                               |
| `boolean`                | `true`              | `?debug=true`                           |
| `string[]`               | `['a','b']`         | `?tags=a&tags=b`                        |
| `number[]` (bit 옵션 X)  | `[1,2,4]`           | `?ids=1&ids=2&ids=4`                    |
| `number[]` (bit 옵션 ✓)  | `[1,2,4]`           | `?ids=7` (bitwise OR: 1\|2\|4 = 7)      |
| `undefined` / `null`     | `undefined`/`null`  | **omitted** (키 생성 안 됨)              |

- **배열 기본 직렬화**는 **반복 키(repeated key)** 방식입니다.  
- 숫자/불리언은 문자열로 변환되어 전송됩니다.  
- `undefined`/`null` 값은 **자동 생략**됩니다.

---

## Array Options

### 기본 배열 직렬화 (Repeated Keys)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class ArrayQueryFrame extends JinFrame {
  @Query() declare readonly tags?: string[];
}

const reply = await ArrayQueryFrame.of({ tags: ['red', 'blue'] }).execute();
// → ?tags=red&tags=blue
```

### Comma-separated 배열

`@Query({ comma: true })`를 사용하면 **쉼표 구분**으로 직렬화됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class CommaQueryFrame extends JinFrame {
  @Query({ comma: true })
  declare readonly tags?: string[];
}

const reply = await CommaQueryFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → ?tags=red,blue,green
```

### Bitwise OR 배열 (숫자 전용)

`@Query({ bit: { enable: true } })`는 숫자 배열을 **비트 OR**로 합산해 하나의 숫자로 직렬화합니다.

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class BitwiseQueryFrame extends JinFrame {
  @Query({ bit: { enable: true } })
  declare readonly flags?: number[];
}

const reply = await BitwiseQueryFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7   (1 | 2 | 4 = 7)
```

> 서버가 비트 마스크를 받는 API에서 유용합니다.

---

## Formatters

`@Query()`는 직렬화 전에 값을 가공하는 **formatter** 옵션을 제공합니다.  
처리 순서: **값 수집 → formatter 적용 → 배열 직렬화(comma/bit 등) → URL 인코딩**

> 규칙  
>
> - `undefined` 또는 `null`을 반환하면 **해당 쿼리 키는 생략**됩니다.  
> - **배열 필드의 경우, formatter가 각 배열 요소마다 적용**되도록 설계되어 있습니다.  
> - 반환값은 원시값(string/number/boolean) 또는 배열이면 됩니다.

### 단일 값 포매팅

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class FormatterSingleFrame extends JinFrame {
  @Query({
    // 앞뒤 공백 제거 후 소문자 변환
    formatter: (v?: string) => (v == null ? undefined : v.trim().toLowerCase()),
  })
  declare readonly q?: string;

  @Query({
    // 숫자 반올림(소수 2자리)
    formatter: (v?: number) => (typeof v === 'number' ? Number(v.toFixed(2)) : undefined),
  })
  declare readonly price?: number;

  @Query({
    // Date → YYYY-MM-DD
    formatter: (d?: Date) =>
      d == null ? undefined :
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
  })
  declare readonly date?: Date;
}

const reply = await FormatterSingleFrame.of({ q: '  Pikachu ', price: 12.345, date: new Date('2025-08-21') }).execute();
// → ?q=pikachu&price=12.35&date=2025-08-21
```

### 배열 요소 포매팅 (요소별 적용)

배열 필드에 대해 선언하면 **각 요소마다 formatter가 적용**됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterArrayFrame extends JinFrame {
  @Query({
    formatter: (tag?: string) => tag?.trim().toLowerCase() || undefined,
  })
  declare readonly tags?: string[]; // 기본: ?tags=a&tags=b
}

const reply = await FormatterArrayFrame.of({ tags: ['  RED ', '  Blue'] }).execute();
// → ?tags=red&tags=blue
```

### 배열 + comma 직렬화 동시 사용

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterCommaFrame extends JinFrame {
  @Query({
    comma: true,
    formatter: (tag?: string) => tag?.replaceAll(',', '').trim() || undefined, // 요소별 적용
  })
  declare readonly tags?: string[];
}

const reply = await FormatterCommaFrame.of({ tags: ['red', ' blue ', 'green,'] }).execute();
// → ?tags=red,blue,green
```

### 숫자 배열 + bitwise OR 동시 사용 (요소별 정규화)

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class FormatterBitFrame extends JinFrame {
  @Query({
    bit: { enable: true },
    formatter: (f?: number) => (Number.isFinite(f) && f! >= 0 ? Number(f) : undefined),
  })
  declare readonly flags?: number[];
}

const reply = await FormatterBitFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7
```

### 매핑/열거형 변환

```ts
const TAG_MAP: Record<string, string> = { red: 'R', blue: 'B', green: 'G' };

@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterMapFrame extends JinFrame {
  @Query({
    formatter: (tag?: string) => (tag ? TAG_MAP[tag] : undefined),
  })
  declare readonly tags?: string[]; // → ?tags=R&tags=B&tags=G
}

const reply = await FormatterMapFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
```

> 팁: 불필요한 요소는 `undefined`를 반환해 자연스럽게 **제외**하세요.

---

## URL Encoding

모든 키와 값은 URL에 추가되기 전에 안전하게 **URL 인코딩**됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class EncodedFrame extends JinFrame {
  @Query() declare readonly q: string;
}

const reply = await EncodedFrame.of({ q: 'hello world & tea' }).execute();
// → ?q=hello%20world%20%26%20tea
```

---

## Optional Queries

값이 없으면 키 자체가 **생략**됩니다.

```ts
@Get({ host: 'https://api.example.com', path: '/items' })
export class OptionalQueryFrame extends JinFrame {
  @Query() declare readonly q?: string;
  @Query() declare readonly page?: number;
}

const reply = await OptionalQueryFrame.of({}).execute();
// → https://api.example.com/items   (쿼리 없음)
```

---

## Combining with Params & Headers

```ts
@Get({ host: 'https://api.example.com', path: '/orgs/:orgId/users' })
export class ListUsersFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Query() declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

const reply = await ListUsersFrame.of({ orgId: 'acme', page: 1, Authorization: 'Bearer token' }).execute();
// → GET /orgs/acme/users?page=1
```

---

## Migration Guide (from `@JinFrame.query`)

```diff
- @JinFrame.query()
+ @Query()
```

나머지 사용 방식(타입, 직렬화 규칙, 옵션 등)은 **동일**합니다.

---

## Debugging Tip

요청 직전에 `frame.getData('query')`로 **최종 쿼리 맵**을 확인할 수 있습니다.

```ts
const frame = SearchFrame.of({ q: 'pikachu', tags: ['red', 'blue'] });
const req = frame.request();

console.log(frame.getData('query')); // { q: 'pikachu', tags: ['red','blue'] }
console.log(req.url);                 // 최종 URL
```
