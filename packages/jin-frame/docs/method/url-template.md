---
outline: deep
---

# URL Template (Path Parameters)

jin-frame uses **RFC 6570 URI Template** syntax for path parameters. Placeholders are written as `{variableName}` — not `:variableName`.

> **Spec**: [RFC 6570 – URI Template](https://www.rfc-editor.org/rfc/rfc6570)  
> **Implementation**: [url-template](https://www.npmjs.com/package/url-template) (npm)

---

## Syntax

```
/path/{variable}
```

| Style | Example | Note |
|-------|---------|------|
| ✅ RFC 6570 (jin-frame) | `/users/{id}` | Correct |
| ❌ Express-style | `/users/:id` | Not supported |

---

## Basic Usage

Declare the path with `{variable}` in the method decorator. Each placeholder must match a field decorated with `@Param()`.

```ts
import { Get, Param, JinFrame } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{userId}/posts/{postId}',
})
class UserPostFrame extends JinFrame {
  @Param() declare readonly userId: string;
  @Param() declare readonly postId: number;
}

const frame = UserPostFrame.of({ userId: 'alice', postId: 42 });
// → GET https://api.example.com/users/alice/posts/42
```

---

## Templates in `host` and `pathPrefix`

URI Template expansion applies to `host` and `pathPrefix` as well, not just `path`. This is useful for multi-tenant or environment-specific URLs.

```ts
@Get({
  host: 'https://{tenant}.api.example.com',
  pathPrefix: '/v{version}',
  path: '/users/{id}',
})
class GetUserFrame extends JinFrame {
  @Param() declare readonly tenant: string;
  @Param() declare readonly version: string;
  @Param() declare readonly id: string;
}

const frame = GetUserFrame.of({ tenant: 'acme', version: '2', id: 'alice' });
// → GET https://acme.api.example.com/v2/users/alice
```

---

## Runtime Override

`host`, `pathPrefix`, and `path` can also be overridden per `_execute()` call. URI template expansion is applied to the overridden values as well.

```ts
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
  path: '/users/{id}',
});
```

---

## Field Name Matching

The placeholder name must exactly match the class field name (case-sensitive). If there is no matching `@Param()` field, the placeholder is left unexpanded and the request will fail.

```ts
@Get({ path: '/users/{id}' })
class Frame extends JinFrame {
  @Param() declare readonly id: string;   // ✅ matches {id}
  // @Param() declare readonly Id: string; // ❌ {id} ≠ {Id}
}
```

---

## Further Reading

- [RFC 6570 – URI Template](https://www.rfc-editor.org/rfc/rfc6570) — Full specification
- [WHATWG URL Standard](https://url.spec.whatwg.org/) — URL parsing and serialization rules
- [@Param decorator](../field/param.md) — Supported types and serialization options
