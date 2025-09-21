# Formatters

The decorators `@Query()`, `@Param()`, `@Body()`, `@ObjectBody()`, and `@Header()` provide the **formatters** option to process values before they are serialized.

Processing steps differ slightly depending on the decorator:

- For `@Query()`, `@Param()`, and `@Header()`:  
  **Collect value → apply formatter (sequential chain) → apply array options (comma/bit) → URL encoding**
- For `@Body()` and `@ObjectBody()`:  
  **Collect value → apply formatter (sequential chain)**

> Rules
>
> - Returning `undefined` or `null` will cause the key to be **omitted**.
> - For **array fields**, formatters are applied **individually to each element**.
> - `formatters` can be a single object or an **array of objects** applied sequentially.
> - Return values can be primitives (`string`, `number`, `boolean`) or arrays.
> - Example: transformations like **string → Date → epoch time** can be chained together.

## Formatter Options

| Field         | Type                                          | Description                                                                                                                                    |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `order`       | `('string' \| 'number' \| 'dateTime')[]`      | Specifies the order in which formatters are applied. Default is `['number', 'string', 'dateTime']`.                                            |
| `ignoreError` | `boolean`                                     | Determines whether to discard the value on error. If `true`, errors are ignored and the value is excluded; if `false`, an exception is thrown. |
| `number`      | `(value: number) => number \| Date \| string` | Formatter for numeric values. May return `number`, `Date`, or `string`.                                                                        |
| `string`      | `(value: string) => string \| Date`           | Formatter for string values. May return `string` or `Date`.                                                                                    |
| `dateTime`    | `(value: Date) => string`                     | Formatter for `Date` values. Must return a `string`.                                                                                           |

## Notes

Formatters operate only if the input type matches (`string`, `number`, or `Date`). If the input type does not match, the transformation may be skipped or the value may be omitted.

- If a transformation does not work as expected, first check that the **input type is correct**.
- If necessary, use the `ignoreError` option to suppress errors and safely exclude invalid values.

## Single Value Formatting

```ts
@Get({ host: 'https://api.example.com', path: '/search' })
export class FormatterSingleFrame extends JinFrame {
  @Query({
    formatters: { string: (v: string) => v.trim().toLowerCase() }, // string → lowercase
  })
  declare readonly q?: string;

  @Query({
    formatters: { number: (v: number) => Number(v.toFixed(2)) }, // number → round to 2 decimals
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

## Array Element Formatting (per element)

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterArrayFrame extends JinFrame {
  @Query({
    formatters: { string: (tag: string) => tag.trim().toLowerCase() }, // applied to each array element
  })
  declare readonly tags?: string[];
}

const reply = await FormatterArrayFrame.of({ tags: ['  RED ', '  Blue'] }).execute();
// → ?tags=red&tags=blue
```

## Multiple Formatters (chained)

### Pass an array of formatters

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

### Use the `order` option

```ts
@Get({ host: 'https://api.example.com', path: '/convert' })
export class FormatterChainFrame extends JinFrame {
  @Query({
    formatters: [
      {
        order: ['number', 'string', 'dateTime'], // number → string → dateTime
        string: (s: string) => new Date(s.trim()), // string → Date
        dateTime: (d: Date) => `${Math.floor(d.getTime())}`, // Date → epoch(ms)
      },
    ],
  })
  declare readonly dates?: string[];
}
```

## Arrays + Comma Serialization with Formatters

```ts
@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterCommaFrame extends JinFrame {
  @Query({
    comma: true, // serialize array with commas
    formatters: { string: (tag: string) => `c-${tag.trim()}` }, // add prefix to each element
  })
  declare readonly tags?: string[];
}

const reply = await FormatterCommaFrame.of({ tags: ['red', ' blue ', 'green,'] }).execute();
// → ?tags=c-red,c-blue,c-green
```

## Numeric Arrays + Bitwise OR with Normalization

```ts
@Get({ host: 'https://api.example.com', path: '/flags' })
export class FormatterBitFrame extends JinFrame {
  @Query({
    bit: { enable: true }, // enable bitwise OR
    formatters: { number: (f?: number) => (Number.isFinite(f) && f! >= 0 ? Number(f) : undefined) },
    // exclude negative or NaN values
  })
  declare readonly flags?: number[];
}

const reply = await FormatterBitFrame.of({ flags: [1, 2, 4] }).execute();
// → ?flags=7
```

## Enum / Mapping Conversion

```ts
const TAG_MAP: Record<string, string> = { red: 'R', blue: 'B', green: 'G' };

@Get({ host: 'https://api.example.com', path: '/filter' })
export class FormatterMapFrame extends JinFrame {
  @Query({
    formatters: { string: (tag?: string) => (tag ? TAG_MAP[tag] : undefined) }, // mapping conversion
  })
  declare readonly tags?: string[];
}

const reply = await FormatterMapFrame.of({ tags: ['red', 'blue', 'green'] }).execute();
// → ?tags=R&tags=B&tags=G
```

## Formatter in @Body and @ObjectBody

`@Body()` and `@ObjectBody()` work with objects, so you must explicitly specify which field the formatter should apply to.  
Use the `findFrom` option to **designate the path**.

```ts
@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class ObjectFormatterExample extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    formatters: [
      {
        findFrom: 'name', // apply formatter to the "name" field
        string(value) {
          return `${value}::111`;
        },
      },
      {
        findFrom: 'date', // apply formatter to the "date" field
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

## Summary

Formatters can be used for various purposes, such as:

- String normalization
- Date transformation
- Array serialization optimization
- Bitmask handling
- Enum/mapping conversion

Especially in `@Body` and `@ObjectBody`, you can apply fine-grained control at the DTO object level, making it possible to manage even complex API requests declaratively and cleanly.
