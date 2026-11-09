---
outline: deep
---

# Formatters

formatter는 request 값을 직렬화하기 전에 변환하며 response 검증과는 다릅니다. query·경로·header formatter는 원시값과 array를 처리하고, body formatter는 `findFrom`으로 중첩 경로도 선택합니다.

## Normalize request fields

```ts twoslash
import { Get, JinFrame, Query } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/search',
})
class SearchFrame extends JinFrame {
  @Query({ formatters: { string: (value) => value.trim().toLowerCase() } })
  declare readonly query: string;

  // Dates become the explicit string representation expected by this API.
  @Query({ formatters: { dateTime: (value) => value.toISOString().slice(0, 10) } })
  declare readonly day?: Date;
}

// Inspect the formatted query parameters, not the original field values.
const request = SearchFrame.of({ query: '  PIKACHU  ', day: new Date('2026-01-01T00:00:00Z') })._request();
console.log(request.url);
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `order` | `('number' \| 'string' \| 'dateTime')[]` | `['number', 'string', 'dateTime']` | 하나의 formatter 안에서 type별 핸들러를 적용하는 순서입니다. |
| `ignoreError` | `boolean` | `undefined` | 기본적으로 예외 시 값을 버리며 false를 지정하면 예외를 전파합니다. |
| `number` | `(value: number) => number \| string \| Date` | `undefined` | 숫자 값을 변환합니다. |
| `string` | `(value: string) => string \| Date` | `undefined` | string을 변환하며 원시 숫자·boolean은 string으로 변환한 뒤 처리할 수 있습니다. |
| `dateTime` | `(value: Date) => string` | `undefined` | Date 값을 string으로 변환합니다. |
| `findFrom` | `string` | `undefined` | body formatter 전용이며 점으로 구분한 경로의 중첩 값을 선택합니다. |

## Typed handlers

| 핸들러 | 입력 | 출력 |
| --- | --- | --- |
| `number` | number | number·string·Date |
| `string` | string | string·Date |
| `dateTime` | Date | string |

기본 핸들러 순서는 number → string → dateTime입니다. 변환 체인이 다른 순서를 요구하면 `order`를 지정합니다. string을 Date로 변환한 뒤 dateTime 핸들러로 처리할 수 있습니다. formatter object array는 여러 단계를 순차 적용합니다.

## Errors and omission

기본적으로 formatter 예외 시 값을 버립니다. `ignoreError: false`를 지정하면 예외를 전파합니다. TypeScript type 선언만으로 입력이 검증되지는 않습니다. array는 요소별 변환 후 직렬화 option을 적용합니다.

## Body paths

body formatter의 `findFrom`은 구조화된 payload의 특정 속성을 선택합니다. query·header·경로 formatter에는 없는 option입니다. 중첩 데이터는 병합과 변환 후 `_request().body`로 확인합니다.

전체 type는 API의 Formatter·SingleBodyFormatter, Zod 검증은 [response 검증](../method/validation)을 참고하세요.
