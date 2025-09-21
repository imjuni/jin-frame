---
outline: deep
---

# Inheritance

In **`jin-frame`**, inheritance can be used to group common functionality or extend only what is needed. This helps keep API request structures simple while allowing flexible handling of diverse endpoints.

## Separating Host and Path

In an MSA architecture, you often communicate with multiple servers. Since the server address (`host`) can change, it is useful to separate `host` and `path` for easier management.

### Parent Class Definition

```ts
import { randomUUID } from 'crypto';

@Timeout(3_000)
@Get({ host: 'https://pokeapi.co' })
class PokemonAPI<PASS = unknown, FAIL = unknown> extends JinFrame<PASS, FAIL> {
  @Query()
  declare public readonly tid: string;

  protected static override getDefaultValues(): Partial<TFieldsOf<InstanceType<typeof PokemonAPI>>> {
    return { tid: randomUUID() };
  }
}
```

- **Shared settings:** `host`, `timeout`
- **Automatic field injection:** `tid` is automatically filled with a UUID for request tracking.

### Child Class Definition

```ts
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  declare public readonly name: string;
}
```

- Inherits the parent class’s `host` and `timeout`.
- The child class only needs to define the `path` and the required `param`.

### Using the Builder Pattern

When using the `of` factory method directly, you need to specify all fields for type safety. In this case, the Builder pattern makes it much easier.

```ts
// set style
const frame = PokemonByNameId.of((b) => b.set('name', 'pikachu'));
const reply = await frame.execute();

// from style
const frame = PokemonByNameId.of((b) => b.from({ name: 'pikachu' }));
const reply = await frame.execute();
```

---

## Managing Timeout and Retry Settings

If the child class redefines the same configuration, it overrides the parent’s setting. This allows you to apply different timeouts or retry policies per endpoint.

```ts
@Timeout(5_000)
@Get({ host: 'https://pokeapi.co' })
class PokeBaseFrame<P = unknown, F = unknown> extends JinFrame<P, F> {
}

@Retry({ max: 5, interval: 1000 })
@Timeout(10_000) // timeout overwrite 5,000 > 10,000
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonByNameId extends PokeBaseFrame {
  @Param()
  declare public readonly name: string;
}

// timeout use parent configuration: 5,000
@Get({ path: '/api/v2/pokemon' })
class PokemonPaging extends PokeBaseFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}
```

- **PokemonByNameId**: 10s timeout, retry up to 5 times with 1s interval
- **PokemonPaging**: 5s timeout, no retry

---

## Hook Extension

Hooks can also be extended in an inheritance structure. This allows you to place common logging or exception handling logic in the parent class and supplement it in the child class as needed.

### Parent Class Hook

```ts
@Timeout(3_000)
@Get({ host: 'https://pokeapi.co' })
class PokemonAPI<PASS = unknown, FAIL = unknown> extends JinFrame<PASS, FAIL> {
  @Query()
  declare public readonly tid: string;

  override async $_postHook(
    _req: TJinRequestConfig,
    reply: AxiosResponse<{ message: string }>,
    _debugInfo: IDebugInfo,
  ) {
    if (reply.status >= 400) {
      // Common error logging
    }
  }
}
```

The reason hook methods use the `$_` prefix is that `jin-frame` reserves this naming to avoid conflicts with field names.

### Extending Hook in Child Class

```ts
@Get({ path: '/api/v2/pokemon/:name' })
class PokemonByNameId extends PokemonAPI<IPokemonData> {
  @Param()
  public declare readonly name: string;

  override async $_postHook(
    _req: TJinRequestConfig,
    reply: AxiosResponse<{ message: string }>,
    _debugInfo: IDebugInfo,
  ) {
    // Execute parent hook
    await super.$_postHook(_req, reply, _debugInfo);

    // Additional logging or post-processing
    ...
  }
}
```

---

## Summary

Using inheritance provides several advantages:

- **Centralized management:** Shared settings such as `host`, `timeout`, `hook`, and `authorization` can be managed in the parent class, improving efficiency.
- **Extensibility:** Child classes only need to declare the `path`, `param`, or special settings, making extension straightforward.
- **Flexible policy application:** Apply different `timeout` and `retry` policies per endpoint, and extend common hooks with additional logic when needed.
- **Type safety:** The Builder pattern ensures safe field initialization, minimizing errors.

In short, inheritance helps you keep shared logic simple while flexibly adapting to endpoint-specific needs, making API request structures **systematic and scalable**.
