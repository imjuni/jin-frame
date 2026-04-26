---
outline: deep
---

# HTTP Method Decorators

**`jin-frame`** provides method decorators for declaring HTTP requests **at the class level**.

Supported decorators: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@Link`, `@Unlink`, `@Purge`, `@Search`

> Key point: Declare **endpoint settings (host, path, timeout, retry, content type, etc.)** as decorator options, and specify **path/query/header/body** fields using `@Param`, `@Query`, `@Header`, `@Body` (or `@ObjectBody`).

## Quick Examples

### GET (Query + Path)

```ts
@Timeout(10_000) // 10s timeout
@Get({
  host: 'https://api.example.com',
  path: '/orgs/{orgId}/users',
  authorization: process.env.YOUR_AUTH_TOKEN,
})
export class ListUsersFrame extends JinFrame {
  @Param()
  declare readonly orgId: string;

  @Query()
  declare readonly page?: number;
}

// Execute
const frame = ListUsersFrame.of({ orgId: 'acme', page: 1 });
const reply = await frame._execute();
```

### POST (JSON Body)

```ts
@Timeout(5_000) // 5s timeout
@Post({
  host: 'https://api.example.com',
  path: '/users',
  // Defaults to application/json when contentType is not specified
})
export class CreateUserFrame extends JinFrame {
  @Body()
  declare readonly name: string;

  @Body()
  declare readonly email: string;
}

// Execute
const frame = CreateUserFrame.of({ name: 'Alice', email: 'alice@acme.com' });
const res = await frame._execute();
```

### POST (multipart/form-data, File Upload)

```ts
@Post({
  host: 'https://upload.example.com',
  path: '/files',
  contentType: 'multipart/form-data',
})
export class UploadFrame extends JinFrame {
  @Body()
  declare readonly title: string;

  @Body()
  declare readonly attachments: JinFile[]; // Supports JinFile or JinFile[]
}

// Execute
const file = new JinFile(new File(['hello'], 'hello.txt'), 'hello.txt');
const frame = UploadFrame.of({ title: 'greeting', attachments: [file] });
await frame._execute();
```

### PUT / PATCH / DELETE

```ts
@Patch({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
export class UpdateUserFrame extends JinFrame {
  @Param()
  declare readonly id: string;

  @Body()
  declare readonly name?: string;
}

@Delete({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
export class DeleteUserFrame extends JinFrame {
  @Param()
  declare readonly id: string;
}
```

## Decorator Options

All method decorators (`@Get`, `@Post`, …) accept common options:

| Option           | Type                                                                                  | Description                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `host`           | `string`                                                                              | Base URL (including protocol). Example: `https://api.example.com`            |
| `path`           | `string`                                                                              | Path. Supports RFC 6570 URI Template placeholders like `{id}`                |
| `pathPrefix`     | `string`                                                                              | Path prefix to prepend to the path, such as `/api`                           |
| `timeout`        | `number`                                                                              | Request timeout (ms). Uses library default if not set                        |
| `retry`          | `{ max: number; interval?: number }` \*                                               | Retry policy. `max` is max attempts, `interval` is delay between retries(ms) |
| `method`         | `string`                                                                              | Normally set internally, but can be overridden for custom methods            |
| `contentType`    | `'application/json' \| 'multipart/form-data' \| 'application/x-www-form-urlencoded'` | Specifies the request content type                                           |
| `customBody`     | `unknown`                                                                             | Provide a **custom body** instead of using decorated fields                  |
| `validateStatus` | `(ok: boolean, status: number) => boolean`                                            | Determine success. Defaults to `(ok) => ok` (native `Response.ok`)          |
| `userAgent`      | `string`                                                                              | Sets User-Agent. May be ignored due to browser security restrictions         |
| `authorization`  | `string \| { username: string; password: string }`                                    | Configure `Authorization` header directly or with Basic Auth                 |
| `validators`     | `{ pass?: BaseValidator; fail?: BaseValidator }`                                      | Validators for pass and fail responses, run independently                    |

## Body Transmission Rules & Content-Type

- **`application/json` (default):** Sends body objects as JSON.  
- **`multipart/form-data`:** Internal FormData handling works **only for POST requests**.  
  - `JinFile` / `JinFile[]` are added as file parts.  
  - Strings/numbers/booleans/objects are stringified and added as form parts.  
- **`application/x-www-form-urlencoded`:** Field values are encoded as `key=value&…` using `URLSearchParams`.

> Note: `multipart/form-data` auto-conversion only works for **POST**. For `PUT/PATCH/DELETE` with multipart, use `customBody`.

## Method Semantics (Idempotency)

- `GET`: Read-only. Pass data via **query/header/path** (no body).
- `POST`: Creation/action. Commonly includes a **body**.
- `PUT` / `PATCH`: Update. Can include body.
- `DELETE`: Deletion. Can include body/query depending on server rules.

## Debugging Tip

```ts
const frame = SomeFrame.of(/* ... */);
const req = frame._requestWrap();

console.log(frame._getOption('method')); // Configured HTTP method
console.log(frame._getData('param'));    // Final Path Params
console.log(frame._getData('query'));    // Final Query Params
console.log(frame._getData('header'));   // Final Headers (before serialization)
console.log(req);                        // Final request config
```

> Use `_requestWrap()` to inspect the request config before sending.
> `_execute()` builds the config and performs the network call in one step.
