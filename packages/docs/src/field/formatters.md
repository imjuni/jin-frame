---
outline: deep
---

# Formatters

Formatters transform request values before serialization. They do not validate responses. Query/path/header formatters handle primitives and arrays; body formatters additionally support selecting a nested path using `findFrom`.

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
| `order` | `('number' \| 'string' \| 'dateTime')[]` | `['number', 'string', 'dateTime']` | Order of typed handlers within one formatter. |
| `ignoreError` | `boolean` | `undefined` | Errors are discarded by default; false propagates them. |
| `number` | `(value: number) => number \| string \| Date` | `undefined` | Transform numeric values. |
| `string` | `(value: string) => string \| Date` | `undefined` | Transform strings; primitive numbers/booleans can be converted to strings first. |
| `dateTime` | `(value: Date) => string` | `undefined` | Serialize Date values. |
| `findFrom` | `string` | `undefined` | Body formatters only: select a nested value by dotted path. |

## Typed handlers

| Handler | Input | Output |
| --- | --- | --- |
| `number` | number | number, string, or Date |
| `string` | string | string or Date |
| `dateTime` | Date | string |

The default handler order is number, string, dateTime. Override `order` when a conversion chain requires another order. A string-to-Date conversion can feed the dateTime handler. An array of formatter objects applies multiple stages.

## Errors and omission

Formatter errors discard values by default. Set `ignoreError: false` to propagate exceptions. Do not assume invalid values become valid just because their TypeScript annotation matches. Arrays are processed element by element before their serialization options.

## Body paths

Use `findFrom` on body formatters to transform a selected property of a structured payload. This is not available on query/header/path formatters. Inspect `_request().body` after formatting and merging when debugging nested data.

See the generated API reference for complete Formatter and SingleBodyFormatter types, and [response validation](../method/validation) for Zod checks.
