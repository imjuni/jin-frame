---
outline: deep
---

# Inheritance and defaults

Keep shared URL settings and fields in a base frame. A subclass overrides endpoint-specific options; inherited decorated fields still participate in the request.

## Typed defaults

Static `this` is not a reliable substitute for the child instance type. The base contract returns `object`; annotate each override with `Partial<PublicFieldsOf<YourClass>>` to check field names and values.

```ts twoslash
import { Get, Header, JinFrame, Param } from 'jin-frame';
import type { PublicFieldsOf } from 'jin-frame';

@Get({
  host: 'https://pokeapi.co',
  pathPrefix: '/api/v2',
})
class PokeApiFrame extends JinFrame {
  // Inherit the field and its HTTP header mapping.
  @Header({ replaceAt: 'X-Request-Id' })
  declare readonly requestId: string;

  protected static override getDefaultValues(): Partial<PublicFieldsOf<PokeApiFrame>> {
    // Generate a value when the factory applies defaults.
    return { requestId: crypto.randomUUID() };
  }
}

@Get({ path: '/pokemon/{name}' })
class PokemonFrame extends PokeApiFrame {
  @Param()
  declare readonly name: string;
}

// The callback supplies name while inherited defaults supply requestId.
const frame = PokemonFrame.of((b) => b.set('name', 'pikachu'));
const reply = await frame._execute();
```

## Merge order

Construction runs first, then defaults, then explicit factory/builder values. Explicit `undefined` is also a value and can overwrite a default. Inherited required fields remain required in the object form of `of()` even when defaults supply them; use the callback form or supply those fields explicitly.

A child's `getDefaultValues()` replaces its parent's method. Use `{ ...super.getDefaultValues(), ...childDefaults }` when both sets are needed. Reusing a frame preserves its assigned defaults; each execution does not regenerate them.

## Response types

If a base is reused across response contracts, make it generic over `Response extends { status: number; data: unknown }` and extend `JinFrame<Response>`. Each concrete endpoint should declare its own status/data union instead of reusing an unrelated body type.
