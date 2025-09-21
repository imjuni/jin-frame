# Formatters

`@Query()`, `@Param()`, `@Body()`, `@ObjectBody()`, `@Header()` 데코레이터는 값이 직렬화되기 전에 가공할 수 있도록 **formatters** 옵션을 제공합니다.

처리 순서는 다음과 같습니다

- `@Query()`, `@Param()`, `@Header()`
  - **값 수집 → formatter 적용(순차 체인) → 배열 옵션(comma/bit) 적용 → URL 인코딩**
- `@Body()`, `@ObjectBody()`
  - **값 수집 → formatter 적용(순차 체인)**

> 규칙
>
> - `undefined` 또는 `null`을 반환하면 해당 키는 **생략**됩니다.
> - **배열 필드**의 경우 formatter는 **각 요소별로 개별 적용**됩니다.
> - `formatters`는 단일 객체 또는 **여러 객체 배열(순차 적용)** 로 지정할 수 있습니다.
> - 반환값은 원시값(string/number/boolean) 또는 배열일 수 있습니다.
> - 예: **string → Date → epoch time** 과 같은 단계적 변환을 체인으로 연결할 수 있습니다.

## Formatter Options

| 필드명        | 타입                                          | 설명                                                                                                                                 |
| ------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `order`       | `('string' \| 'number' \| 'dateTime')[]`      | 포맷터 적용 순서를 지정합니다. 기본값은 `['number', 'string', 'dateTime']` 입니다.                                                   |
| `ignoreError` | `boolean`                                     | 변환 중 오류가 발생했을 때 값을 버릴지 여부를 설정합니다. `true`이면 오류를 무시하고 값을 제외하며, `false`이면 예외를 발생시킵니다. |
| `number`      | `(value: number) => number \| Date \| string` | 숫자 값을 변환하는 함수입니다. 반환값은 `number`, `Date`, `string` 중 하나일 수 있습니다.                                            |
| `string`      | `(value: string) => string \| Date`           | 문자열 값을 변환하는 함수입니다. 반환값은 `string` 또는 `Date`입니다.                                                                |
| `dateTime`    | `(value: Date) => string`                     | `Date` 객체를 문자열로 변환하는 함수입니다.                                                                                          |

## 유의 사항

Formatter는 지정된 입력 타입(`string`, `number`, `Date`)에 맞게 동작합니다. 입력값이 기대 타입과 일치하지 않으면 변환이 수행되지 않거나, 값이 생략될 수 있습니다.

- 변환이 되지 않는 경우 먼저 **입력값의 타입이 올바른지 확인**하세요.
- 필요한 경우 `ignoreError` 옵션을 활용해 예외를 무시하고 안전하게 값을 제외할 수 있습니다.

## 단일 값 포매팅

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class FormatterSingleFrame extends JinFrame {
  @Query({
    formatters: { string: (v: string) => v.trim().toLowerCase() }, // 문자열 → 소문자로 변환
  })
  declare readonly q?: string;

  @Query({
    formatters: { number: (v: number) => Number(v.toFixed(2)) }, // 숫자 → 소수점 둘째자리까지 반올림
  })
  declare readonly price?: number;

  @Query({
    formatters: {
      dateTime: (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    },
    // Date → yyyy-MM-dd
  })
  declare readonly date?: Date;
}

const reply = await FormatterSingleFrame.of({
  q: '  Pikachu ',
  price: 12.345,
  date: new Date('2025-08-21'),
}).execute();
// → ?q=pikachu&price=12.35&date=2025-08-21
```

## 배열 요소 포매팅 (요소별 적용)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterArrayFrame extends JinFrame {
  @Query({
    formatters: { string: (tag: string) => tag.trim().toLowerCase() }, // 배열의 각 요소에 적용
  })
  declare readonly tags?: string[];
}

const reply = await FormatterArrayFrame.of({ tags: ['  RED ', '  Blue'] }).execute();
// → ?tags=red&tags=blue
```

## 다중 Formatter (체인 적용)

### 배열로 formatter 여러 개 전달

```ts
@Get({ host: 'https://api.example.com', path: '/convert' })
export class FormatterChainFrame extends JinFrame {
  @Query({
    formatters: [
      { string: (s: string) => s.trim() }, // string → trimmed string
      { string: (s: string) => new Date(s) }, // string → Date
      { dateTime: (d: Date) => `${Math.floor(d.getTime())}` }, // Date → epoch(ms)
    ],
  })
  declare readonly dates?: string[];
}

const reply = await FormatterChainFrame.of({ dates: ['2025-08-01', '2025-08-02'] }).execute();
// → ?dates=1754006400000&dates=1754092800000
```

### order 옵션 사용

```ts
@Get({ host: 'https://api.example.com', path: '/convert' })
export class FormatterChainFrame extends JinFrame {
  @Query({
    formatters: [
      {
        order: ['number', 'string', 'dateTime'], // number → string → dateTime 순서대로 실행
        string: (s: string) => new Date(s.trim()), // string → Date
        dateTime: (d: Date) => `${Math.floor(d.getTime())}`, // Date → epoch(ms)
      },
    ],
  })
  declare readonly dates?: string[];
}
```

## 배열 + 쉼표 직렬화와 Formatters 동시 적용

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterCommaFrame extends JinFrame {
  @Query({
    comma: true, // 배열을 쉼표로 직렬화
    formatters: { string: (tag: string) => `c-${tag.trim()}` }, // 각 요소 앞에 접두사 추가
  })
  declare readonly tags?: string[];
}

const reply = await FormatterCommaFrame.of({ tags: ['red', ' blue ', 'green,'] }).execute();
// → ?tags=c-red,c-blue,c-green
```

## 숫자 배열 + 비트 OR 직렬화와 정규화

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class FormatterBitFrame extends JinFrame {
  @Query({
    bit: { enable: true }, // 비트 OR 직렬화 활성화
    formatters: { number: (f?: number) => (Number.isFinite(f) && f! >= 0 ? Number(f) : undefined) },
    // 음수나 NaN 값은 제외
  })
  declare readonly flags?: number[];
}

const reply = await FormatterBitFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7
```

## Enum / 매핑 변환

```ts
const TAG_MAP: Record<string, string> = { red: 'R', blue: 'B', green: 'G' };

@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterMapFrame extends JinFrame {
  @Query({
    formatters: { string: (tag?: string) => (tag ? TAG_MAP[tag] : undefined) }, // 매핑 변환
  })
  declare readonly tags?: string[];
}

const reply = await FormatterMapFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → ?tags=R&tags=B&tags=G
```

## @Body, @ObjectBody에서의 Formatter

`@Body()`와 `@ObjectBody()`는 객체를 다루기 때문에, 객체의 어떤 필드에 formatter를 적용할지 명시해야 합니다.  
이때 `findFrom` 옵션을 사용하여 **경로를 지정**합니다.

```ts
@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class ObjectFormatterExample extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    formatters: [
      {
        findFrom: 'name', // 객체의 name 필드에 formatter 적용
        string(value) {
          return `${value}::111`;
        },
      },
      {
        findFrom: 'date', // 객체의 date 필드에 formatter 적용
        dateTime(value) {
          const f = lightFormat(value, 'yyyy-MM-dd');
          return f;
        },
      },
    ],
  })
  declare public readonly ability: {
    name: string;
    date: Date;
    desc: string;
  };
}
```

## 결론

formatter는 다양한 목적으로 사용할 수 있습니다:

- 문자열 정규화
- 날짜 변환
- 배열 직렬화 최적화
- 비트 마스크 처리
- 매핑/열거형 변환

특히 `@Body`, `@ObjectBody`에서도 DTO 객체 단위로 세밀한 제어가 가능하여, 복잡한 API 요청도 선언적으로 깔끔하게 관리할 수 있습니다.
