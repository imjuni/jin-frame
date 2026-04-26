---
outline: deep
---

# Builder Pattern

`JinFrame` provides two static factory methods — `builder()` and `of()` — for creating frame instances without a constructor. Both support TypeScript's phantom-type tracking to catch missing fields **at compile time**.

## of()

`of()` creates an instance from a plain object or a builder callback. It is the simplest way to create a frame.

### Plain object

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';

@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;

  @Query()
  declare public readonly expand?: string;
}

const frame = GetUserFrame.of({ id: '123', expand: 'roles' });
const reply = await frame._execute();
```

### Builder callback

```ts
const frame = GetUserFrame.of((b) =>
  b.set('id', '123').set('expand', 'roles'),
);
```

---

## builder()

`builder()` returns a `BuilderFor<C>` object whose phantom type parameter `TSet` accumulates the keys you have set. **`build()` only becomes available once every public field has been assigned**, turning a forgotten field into a compile-time error instead of a runtime bug.

```ts
const frame = GetUserFrame.builder()
  .set('id', '123')
  .set('expand', 'roles')
  .build(); // ✅ all fields set — build() is callable

const frame2 = GetUserFrame.builder()
  .set('expand', 'roles')
  .build(); // ❌ compile error: 'id' is missing
```

### Chaining methods

| Method          | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `.set(k, v)`    | Set a single public field. Type of `v` is inferred from `k`.  |
| `.from(obj)`    | Bulk-set from a partial object.                                |
| `.auto()`       | Apply class-level default values (from `getDefaultValues()`).  |
| `.get()`        | Return the accumulated field snapshot without building.        |
| `.build()`      | Instantiate the frame. Only available when all fields are set. |

```ts
const frame = GetUserFrame.builder()
  .auto()           // apply defaults first
  .from({ id: '123' }) // then override
  .build();
```

---

## Constructor Arguments

For frames whose constructor requires arguments, pass them after the field argument in `of()`, or as leading arguments in `builder()`.

```ts
@Get({ host: 'https://api.example.com', path: '/users/{id}' })
class AuthedFrame extends JinFrame<User> {
  constructor(private readonly tenant: string) {
    super();
  }

  @Param()
  declare public readonly id: string;
}

// of() — field object first, ctor args after
const frame = AuthedFrame.of({ id: '123' }, 'acme');

// builder() — ctor args passed to builder()
const frame2 = AuthedFrame.builder('acme').set('id', '123').build();
```

---

## Default Values

Override the static `getDefaultValues()` method to provide field defaults that are applied automatically by `auto()` and merged during `build()`.

```ts
@Get({ host: 'https://api.example.com', path: '/users' })
class ListUsersFrame extends JinFrame<User[]> {
  @Query()
  declare public readonly page: number;

  @Query()
  declare public readonly limit: number;

  protected static override getDefaultValues() {
    return { page: 1, limit: 20 };
  }
}

const frame = ListUsersFrame.builder()
  .auto()           // page=1, limit=20 from defaults
  .set('page', 3)   // override page
  .build();
```

---

## Type Safety Details

`PublicFieldsOf<T>` — the type used by both `builder()` and `of()` — automatically excludes:

- Methods (function-typed properties)
- Fields prefixed with `_` (internal frame properties such as `_startAt`, `_option`)

This means you only set the fields you actually declared on the subclass, not framework internals.
