---
outline: deep
---

# Factory and Builder

## of()

Use an object for a complete field assignment, or a callback to configure a builder. No required public fields means the argument may be omitted. Constructor arguments follow the fields argument; use `undefined` as its placeholder when necessary.

```ts twoslash
import { Get, JinFrame, Param, Query } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly id: string;

  @Query()
  declare readonly expand?: string;
}

// Optional fields do not gate build().
const user = UserFrame.builder().set('id', '123').build();
const same = UserFrame.of({ id: '123' });
const fromCallback = UserFrame.of((b) => b.set('id', '123'));

@Get({
  host: 'https://api.example.com',
  path: '/health',
})
class HealthFrame extends JinFrame {}

// No required public fields: an empty object is unnecessary.
const health = HealthFrame.of();
```

## Builder operations

| Method | Behavior |
| --- | --- |
| `set(key, value)` | Assign one public non-function field with its declared type. |
| `from(object)` | Copy enumerable string-keyed fields from an object. |
| `auto()` | Copy class defaults into the builder at this point in the chain. |
| `get()` | Return a readonly type view of live builder state, not a snapshot. |
| `build()` | Construct a fresh instance and merge defaults, then builder values. |

Methods and underscore-prefixed fields are excluded. Protected and private fields are not public inputs. Optional fields do not have to be set before `build()`.

## Defaults and type guarantees

Defaults are applied by both `of()` and `build()`. `auto()` additionally copies defaults into the builder, overwriting values already present; later `set()` calls win. Avoid side effects in default generation when calling `auto()` and `build()` together because both call the defaults method.

For compatibility, `auto()` marks every field complete, `from()` tracks optional input keys, and callbacks do not enforce completeness. These paths do not prove required values exist at runtime. Keep runtime input checks where necessary.

`get()` is shallow and live: later builder assignments are visible through earlier views. Built frames also share nested object references; neither API deep-clones or freezes input values.

## Constructor arguments

Call `UserFrame.of(fields, ...constructorArgs)` or `UserFrame.builder(...constructorArgs)`. A fieldless class with a required constructor argument uses `Frame.of(undefined, argument)`; omitting fields does not make constructor arguments optional.

See [inheritance and typed defaults](./inheritance).
