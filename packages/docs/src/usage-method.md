---
outline: deep
---

# HTTP Methods

Use decorators such as `@Get()` and `@Post()` to choose the HTTP method and URL. Field decorators such as `@Param()`, `@Query()`, and `@Body()` supply the request values.

## Method decorators

| Decorator | HTTP method | Purpose |
| --- | --- | --- |
| `@Get()` | `GET` | Read a resource. |
| `@Post()` | `POST` | Create a resource or submit an action. |
| `@Put()` | `PUT` | Replace a resource. |
| `@Patch()` | `PATCH` | Update part of a resource. |
| `@Delete()` | `DELETE` | Delete a resource. |
| `@Head()` | `HEAD` | Retrieve response headers without a body. |
| `@Options()` | `OPTIONS` | Inspect endpoint communication options. |
| `@Search()` | `SEARCH` | Use an API-defined search method. |
| `@Purge()` | `PURGE` | Use an API-defined cache purge method. |
| `@Link()` | `LINK` | Use an API-defined resource-linking method. |
| `@Unlink()` | `UNLINK` | Use an API-defined resource-unlinking method. |
| `@Trace()` | `TRACE` | Declare TRACE; native fetch rejects this method. |

These decorators select method names; actual transmission depends on fetch and server support.

## Common options

Defaults below assume no inherited configuration.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | `string \| (() => string)` | `undefined` | API host, including protocol; accepts URL placeholders. |
| `pathPrefix` | `string \| (() => string)` | `undefined` | Shared path inserted before path. |
| `path` | `string \| (() => string)` | `undefined` | Endpoint path, including URL placeholders. |
| `contentType` | `string` | `'application/json'` | Body serialization format. |
| `timeout` | `number` | `120000` | Timeout per HTTP attempt in milliseconds. |
| `retry` | `FrameRetry` | `undefined` | Attempt limit and retry delay; default is one attempt. |
| `security` | `SecurityProvider \| SecurityProvider[]` | `undefined` | Providers that construct authentication context. |
| `authorization` | `AuthorizationData` | `undefined` | Fallback credentials passed to security providers. |
| `validator` | `ResponseValidator` | `undefined` | One validator for the complete HTTP response. |
| `dedupe` | `boolean` | `undefined` | Enable concurrent request deduplication when true. |
| `customBody` | `unknown` | `undefined` | Custom body instead of decorated body assembly. |
| `userAgent` | `string` | `undefined` | User-Agent header for the request. |

URL placeholders work in the protocol, host, path prefix, and path. See [URL templates](./method/url-template) for an example.

## GET and POST example

```ts twoslash
import { Body, Get, JinFrame, Param, Post } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
  timeout: 2_000,
})
class GetUserFrame extends JinFrame<{ status: 200; data: { name: string } }> {
  // Substitute the field into the URL.
  @Param()
  declare readonly id: string;
}

@Post({
  host: 'https://api.example.com',
  path: '/users',
})
class CreateUserFrame extends JinFrame<{ status: 201; data: { id: string } }> {
  // Include the field in the JSON request body.
  @Body()
  declare readonly name: string;
}

// Inspect requests without contacting the example server.
const getRequest = GetUserFrame.of({ id: '123' })._request();
const postRequest = CreateUserFrame.of({ name: 'ironman' })._request();
console.log(getRequest.method, getRequest.url);
console.log(postRequest.method, postRequest.body);
```

## Executing requests

| Method | Behavior |
| --- | --- |
| `_request()` | Build request configuration without sending. |
| `_create()` | Return a function that executes the request. |
| `_execute()` | Resolve async authorization and execute. |

Send a request with `await GetUserFrame.of({ id: '123' })._execute()`.

## Call options

| Option | Behavior |
| --- | --- |
| `host, pathPrefix, path` | Override the URL for this call. |
| `url` | Provide a full URL instead of composing host and path. |
| `validateStatus` | Choose accepted HTTP statuses. |
| `dynamicAuth` | Override authentication for this call. |
| `auth` | Supply Basic username/password credentials. |
| `signal` | Cancel through an AbortSignal. |
| `timeout` | Override the per-attempt timeout in milliseconds. |
| `cloneRaw` | Preserve a readable raw response copy. |
| `deserialize` | Parse response text with a custom function. |

Pass `validateStatus` when executing, not in an HTTP decorator. See [status unions and errors](./method/responses) for response handling.
