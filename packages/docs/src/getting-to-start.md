---
outline: deep
---

# Getting started

jin-frame 6 defines requests as classes and executes them with native `fetch`. Install the runtime in the application that sends requests; generators are optional development tools.

## Install

```sh
pnpm add jin-frame@^6
pnpm add -D typescript
```

The package declares Node.js `^22.23.4` and TypeScript >= 5. Use TypeScript with legacy decorators enabled; Node's type stripping alone does not compile these decorators.

## TypeScript configuration

```jsonc
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Use `"type": "module"` in package.json for the top-level await examples. Compile with `tsc`, then run the emitted JavaScript with Node.

## First request

Hover over identifiers to inspect their types and documentation. This example calls the public PokeAPI; examples using `api.example.com` elsewhere require your own server.

```ts twoslash
import { Get, JinFrame, Param } from 'jin-frame';

/** A successful Pokémon detail response. */
type PokemonReply = { status: 200; data: { name: string; id: number } };

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
class PokemonFrame extends JinFrame<PokemonReply> {
  // Bind this field to the URL placeholder.
  @Param()
  declare readonly name: string;
}

// Create an instance with the required request field.
const frame = PokemonFrame.of({ name: 'pikachu' });
const reply = await frame._execute();

// The response union determines the body type; it does not validate server data.
console.log(reply.data.name);
```

## Declaring fields

`declare` avoids emitted field initializers. `readonly` prevents reassignment in TypeScript; it does not freeze nested objects. Optional fields use `?` and can be omitted. Frames without required public fields accept `Frame.of()`.

Continue with [HTTP Methods](./usage-method), [builders](./method/builder), and [response validation](./method/validation).
