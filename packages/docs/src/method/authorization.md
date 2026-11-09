---
outline: deep
---

# Authorization

Security providers turn credentials into headers, query parameters, or cookies. `authorization` alone does not create a header. The first constructor argument is now a key or synchronous key supplier, not a provider name.

## Bearer tokens

Suppliers read the current value when a request is built. They are not evaluated if a string `dynamicAuth` overrides them. Do not pass async functions to provider constructors.

```ts twoslash
import { BearerTokenProvider, Get, JinFrame } from 'jin-frame';

// Replace this value when your application refreshes its token.
let accessToken = 'initial-token';
const bearer = new BearerTokenProvider(() => accessToken);

@Get({
  host: 'https://api.example.com',
  path: '/me',
  security: bearer,
})
class ProfileFrame extends JinFrame {}

// Inspect the generated header without sending a request.
const frame = ProfileFrame.of();
console.log(frame._request().headers);

// Override only this execution; the shared provider is unchanged.
const reply = await frame._execute({ dynamicAuth: 'per-request-token' });
```

## API keys and Basic credentials

```ts twoslash
import { ApiKeyProvider, BasicAuthProvider, BearerTokenProvider } from 'jin-frame';

// The destination is independent of the optional provider metadata name.
const headerKey = new ApiKeyProvider('secret', 'X-API-Key');
const queryKey = new ApiKeyProvider(() => 'current-key', 'api_key', 'query');
const cookieKey = new ApiKeyProvider('session-value', 'session', 'cookie');

// Basic expects Base64-encoded user:password; Bearer adds its own prefix.
const basic = new BasicAuthProvider(() => btoa('user:password'));
const bearer = new BearerTokenProvider('access-token');

// Full HTTP credentials can also use the common provider directly.
const custom = new ApiKeyProvider(() => 'Bearer access-token', 'Authorization');
```

Basic and Bearer extend `ApiKeyProvider`. Their formatter adds the scheme prefix only when missing. `setKey(stringOrSupplier)` replaces the shared source for future requests.

## Priority and composition

A literal `Authorization` header bypasses providers. Call-level Basic `auth` is next. Otherwise, providers resolve string `dynamicAuth`, their own key, then decorator `authorization`. Basic retains legacy `{ username, password }` authorization support.

A provider array is processed in order. Headers and queries are merged; later values for the same key win. Give each provider its own constructor key when credentials differ. A shared `dynamicAuth` applies to every provider, not to a provider selected by name. Names are metadata, supplied as the second Basic/Bearer argument or fourth API-key argument.

## Async credentials

```ts twoslash
import { BearerTokenProvider, Get, JinFrame, Security } from 'jin-frame';

/** Replace with your secret manager's asynchronous lookup. */
async function loadToken(): Promise<string> {
  return 'resolved-token';
}

// _execute() awaits the authorization supplier before building the request.
@Security(new BearerTokenProvider(), loadToken)
@Get({
  host: 'https://api.example.com',
  path: '/me',
})
class AsyncProfileFrame extends JinFrame {}

const reply = await AsyncProfileFrame.of()._execute();
```

`_request()` is synchronous and does not resolve async authorization. Use `_execute()` for this path. Empty strings are not rejected by providers; validate missing credentials in application code. Authentication does not redact logs automatically.
