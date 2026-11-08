---
outline: deep
---

# Inheritance

Define shared settings and hooks in a base frame class. Subclasses inherit them and can override settings for each endpoint.

## Separating Host and Path

In an MSA architecture, you often communicate with multiple servers. Since the server address (`host`) can change, it is useful to separate `host` and `path` for easier management.

### Parent Class Definition

```ts
import { randomUUID } from 'crypto';

@Timeout(3_000)
@Get({ host: 'https://pokeapi.co' })
class PokemonAPI<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
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
type PokemonResponse =
  | { status: 200; data: IPokemonData }
  | { status: 404; data: { message: string } };
```

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends PokemonAPI<PokemonResponse> {
  @Param()
  declare public readonly name: string;
}
```

- Inherits the parent class’s `host` and `timeout`.
- The child class only needs to define the `path` and the required `param`.

### Using the Builder Pattern

The builder callback can supply `name` while `getDefaultValues()` supplies `tid`.

```ts
const frame = PokemonByNameId.of((b) => b.set('name', 'pikachu'));
const reply = await frame._execute();

// from style
const frame = PokemonByNameId.of((b) => b.from({ name: 'pikachu' }));
const reply = await frame._execute();
```

---

## Managing Timeout and Retry Settings

If the child class redefines the same configuration, it overrides the parent’s setting. This allows you to apply different timeouts or retry policies per endpoint.

```ts
@Timeout(5_000)
@Get({ host: 'https://pokeapi.co' })
class PokeBaseFrame<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
}

@Retry({ max: 5, interval: 1000 })
@Timeout(10_000) // timeout overwrite 5,000 > 10,000
@Get({ path: '/api/v2/pokemon/{name}' })
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
class PokemonAPI<OperationResponse extends { status: number; data: unknown } = { status: number; data: unknown }> extends JinFrame<OperationResponse> {
  @Query()
  declare public readonly tid: string;

  override async _postHook(
    _req: JinRequestConfig,
    reply: JinResp<OperationResponse>,
    _debugInfo: DebugInfo,
  ) {
    if (!reply.ok) {
      // Common error logging
    }
  }
}
```

The reason hook methods use the `_` prefix is that `jin-frame` applies this to all instance methods to prevent collisions with user-declared field names. See [Naming Convention](./naming-convention.md) for the full rules.

### Extending Hook in Child Class

```ts
@Get({ path: '/api/v2/pokemon/{name}' })
class PokemonByNameId extends PokemonAPI<PokemonResponse> {
  @Param()
  public declare readonly name: string;

  override async _postHook(
    _req: JinRequestConfig,
    reply: JinResp<PokemonResponse>,
    _debugInfo: DebugInfo,
  ) {
    // Execute parent hook
    await super._postHook(_req, reply, _debugInfo);

    if (reply.status === 200) {
      // Data is narrowed to IPokemonData.
      console.log(reply.data);
    }
  }
}
```
