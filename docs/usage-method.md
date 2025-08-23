---
outline: deep
---

# HTTP Method Decorators

**`jin-frame`** provides method decorators for declaring HTTP requests **at the class level**.

Supported decorators: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@Link`, `@Unlink`, `@Purge`, `@Search`

> Key point: Declare **endpoint settings (host, path, timeout, retry, content type, etc.)** as decorator options, and specify **path/query/header/body** fields using `@Param`, `@Query`, `@Header`, `@Body` (or `@ObjectBody`).

## Quick Examples

### GET (Query + Header + Path)

```ts
@Get({
  host: 'https://api.example.com',
  path: '/orgs/:orgId/users',
  timeout: 10_000, // ms
})
export class ListUsersFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Query() declare readonly page?: number;
  @Header() declare readonly Authorization: string;
}

// Execute
const res = await ListUsersFrame.of({ orgId: 'acme', page: 1, Authorization: 'Bearer token' }).execute();
```

### POST (JSON Body)

```ts
@Post({
  host: 'https://api.example.com',
  path: '/users',
  timeout: 5_000,
  // Default (when contentType is not set) is application/json
})
export class CreateUserFrame extends JinFrame {
  @Body('name') declare readonly name: string;
  @Body('email') declare readonly email: string;
}

// Execute
const res = await CreateUserFrame.of({ name: 'Alice', email: 'alice@acme.com' }).execute();
```

### POST (multipart/form-data, File Upload)

```ts
@Post({
  host: 'https://upload.example.com',
  path: '/files',
  contentType: 'multipart/form-data',
})
export class UploadFrame extends JinFrame {
  @Body('title') declare readonly title: string;
  @Body('attachments') declare readonly attachments: JinFile[]; // Supports JinFile or JinFile[]
}

// Execute
const file = new JinFile(new File(['hello'], 'hello.txt'), 'hello.txt');
await UploadFrame.of({ title: 'greeting', attachments: [file] }).execute();
```

### PUT / PATCH / DELETE

```ts
@Patch({ host: 'https://api.example.com', path: '/users/:id' })
export class UpdateUserFrame extends JinFrame {
  @Param() declare readonly id: string;
  @Body('name') declare readonly name?: string;
}

@Delete({ host: 'https://api.example.com', path: '/users/:id' })
export class DeleteUserFrame extends JinFrame {
  @Param() declare readonly id: string;
}
```

## Decorator Options

All method decorators (`@Get`, `@Post`, …) accept common options:

| Option             | Type                                                                                 | Description                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `host`             | `string`                                                                             | Base URL (including protocol). Example: `https://api.example.com`           |
| `path`             | `string`                                                                             | Path. Supports **Path Param** placeholders like `:id`                       |
| `timeout`          | `number`                                                                             | Request timeout (ms). Uses library default if not set                       |
| `retry`            | `{ max: number; interval?: number }` \*                                              | Retry policy. `max` is max attempts, `interval` is delay between retries(ms)|
| `method`           | `string`                                                                             | Normally set internally, but can be overridden for custom methods           |
| `contentType`      | `'application/json' \| 'multipart/form-data' \| 'application/x-www-form-urlencoded'` | Specifies the request content type                                          |
| `customBody`       | `unknown`                                                                            | Provide a **custom body** instead of using decorated fields                 |
| `transformRequest` | `AxiosRequestTransformer \| AxiosRequestTransformer[]`                               | Axios request transformer. Defaults to `x-www-form-urlencoded` transformer  |
| `validateStatus`   | `(status: number) => boolean`                                                        | Axios status validator. Works with retry conditions                         |
| `userAgent`        | `string`                                                                             | Sets User-Agent. May be ignored due to browser security restrictions        |
| `authorization`    | `string` or `{ username: string; password: string }`                                 | Configure `Authorization` header directly or with Basic Auth                |

## Body Transmission Rules & Content-Type

- **`application/json` (default):** Sends body objects as JSON.  
- **`multipart/form-data`:** Internal FormData handling works **only for POST requests**.  
  - `JinFile` / `JinFile[]` are added as file parts.  
  - Strings/numbers/booleans/objects are stringified and added as form parts.  
- **`application/x-www-form-urlencoded`:** The library injects a default `transformRequest` to encode as `key=value&…`.  
  - If a custom `transformRequest` is provided, that takes precedence.

> Note: `multipart/form-data` auto-conversion only works for **POST**. For `PUT/PATCH/DELETE` with multipart, use `customBody` or `transformRequest`.

## Method Semantics (Idempotency)

- `GET`: Read-only. Pass data via **query/header/path** (no body).  
- `POST`: Creation/action. Commonly includes a **body**.  
- `PUT` / `PATCH`: Update. Can include body.  
- `DELETE`: Deletion. Can include body/query depending on server rules.  

Since the library passes `data` to Axios, bodies are possible for `PUT/PATCH/DELETE` if the server supports them.

## Debugging Tip

```ts
const frame = SomeFrame.of(/* ... */);
const req = frame.request();

console.log(frame.getOption('method')); // Configured HTTP method
console.log(frame.getData('param')); // Final Path Params
console.log(frame.getData('query')); // Final Query Params
console.log(frame.getData('header')); // Final Headers (before serialization)
console.log(req); // Final Axios request config
```

> If you want to inspect the request before sending, use `.request()` to get the Axios config object.  
> `.execute()` actually performs the network call.
