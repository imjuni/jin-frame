---
outline: deep
---

# URL templates

Declare URL templates in the `host`, `pathPrefix`, and `path` options of an HTTP method decorator such as `@Get()`. Supply placeholder values through `@Param()` fields.

## Host, prefix, and path

```ts twoslash
import { Get, JinFrame, Param } from 'jin-frame';

@Get({
  host: 'https://{tenant}.api.example.com',
  pathPrefix: '/v{version}',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly tenant: string;

  @Param()
  declare readonly version: number;

  // Map a local field name to the template variable.
  @Param({ replaceAt: 'id' })
  declare readonly userId: string;
}

const frame = UserFrame.of({ tenant: 'acme', version: 2, userId: 'alice' });

// Inspect https://acme.api.example.com/v2/users/alice without sending.
console.log(frame._request().url);

// Per-call overrides also participate in template expansion.
const request = frame._request({ path: '/accounts/{id}' });
console.log(request.url);
```

See [Path parameters](../field/param) for field renaming and value formatting options.
