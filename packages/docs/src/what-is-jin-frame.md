---
outline: deep
---

# What is jin-frame?

jin-frame is a declarative HTTP client for TypeScript. An endpoint is a class containing its method, URL, typed inputs, authentication, retry settings, and response contract. Execution uses native fetch, not Axios.

## Choose the right entry point

| Goal | Start here |
| --- | --- |
| Write request classes by hand | [Getting started](./getting-to-start) |
| Generate clients from Swagger/OpenAPI | [CLI](./generator-cli/) |
| Embed generation in a tool or build | [Generator core](./generator-core/) |
| Upgrade a client | [Migration to v6](./migration-v6) |

## Request lifecycle

1. `of()` or `builder()` creates an instance and applies field defaults.
2. `_execute()` resolves asynchronous authorization and assembles URL, fields, and security context.
3. The pre-hook runs, then eligible deduplication, per-attempt timeout, and retry handling wrap fetch.
4. The response is deserialized and validated using its status and body.
5. Accepted responses return; rejected statuses or processing failures throw.

## Type safety and runtime safety

A status/data union preserves the relationship between HTTP status and body type. `validateStatus` controls which statuses a call accepts. Zod or another validator checks the actual server data. These are separate responsibilities: neither TypeScript nor accepting an HTTP code validates JSON by itself.

## Organization

Use base frames for shared hosts and headers, fields for request data, and providers for credentials. Hooks support logging and metrics without scattering transport logic through application code. Generated clients use the same runtime as handwritten frames.

The guide examples use legacy TypeScript decorators and imports from the public `jin-frame` package. Hover-enabled examples are typechecked while building this site.
