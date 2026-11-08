# Roadmap

## Current status

There are 13 unchecked top-level items: 10 implementation, testing, or convenience items (6 runtime, 1 CLI, 3 core), plus 3 feasibility studies.

Completion reflects repository implementation and tests, not publication. Status/data response unions, call-level status inference, whole-response validation, and unified package documentation are implemented. Content-type discrimination remains incomplete: media types are combined into each status payload union. The response-union integration test compiles generated code with the TypeScript compiler API; installed tarball CLI smoke testing remains separate.

Prioritize local packaged CLI and schema composition smoke coverage before release. Caching, progress events, and other planned capabilities are follow-up features rather than automatic 6.0 release blockers. See the [Korean roadmap](./ROADMAP.ko.md) for the detailed current audit.

## jin-frame

- [ ] Built-in mocking (MSW integration guides and tests exist, but no library-owned mock registry)
  - Support registering mocks as an array
  - Each array element follows the format: { url: string; params: self, reply: unknown }
    - params refers to the type. When checking cache matches, passing member variables will also match those values
  - When executing or making requests, iterate through the array to return responses
- [ ] Add BigInt type (Long type) serialization functionality
- [ ] Implement endpoint/query-based memory or LRU response caching
  - Calculate cache timeout and re-execute when timeout expires, otherwise return cached result
  - Explore cache strategies like stale-while-revalidate (similar to SWR)
  - Research cache-related headers
- [ ] Create a simple server with fastify for testing file uploads and other features
- [ ] Upload/download progress events
- [x] Runtime host and authorization overrides
  - Request options provide URL overrides and dynamicAuth. This does not claim Next.js-specific integration coverage.
- [ ] Status code and content type specific response models
  - OpenAPI responses are defined by `status-code + content-type -> response schema`.
  - Support distinct success and failure DTOs by status code and content type without losing OpenAPI contract information.
  - Status unions and default 2xx inference are complete; media-type discrimination is not. Current generated data unions combine media types within each status.

### Feasibility Study

- [ ] Powerful cache layer (IndexedDB/AsyncStorage)
- [ ] Authentication templates (plugin-like integration, feasibility assessment needed for both node + browser compatibility)
- [ ] Multi-transport adapters (assess a native fetch interface with injectable implementations for Edge/Node/Deno/React Native)
  - Fix fetch adapter interface and inject environment-specific implementations:
  - Node: undici
  - Edge/Cloudflare: Web Fetch
  - RN: cross-fetch or whatwg-fetch polyfill
  - Deno: native fetch

### Completed

- [x] Array bracket handling 1: fruit[]=apple&fruit[]=banana
- [x] Array bracket handling 2: fruit[1]=apple&fruit[2]=banana
- [x] Retry-After header processing
- [x] Response validation processing - automatically validate responses when validators are added to methods during class declaration
  - Support for zod, json-schema (ajv), etc.
- [x] Request deduplication/burst prevention
  - Single response for multiple rapid requests to the same address with identical conditions

## generator-cli

- [ ] Generate multiple BaseFrames when there are multiple servers
  - Properly add host and path when BaseFrame is not used

### Completed

- [x] Generate jin-frame based on Authorization configuration
  - Generate custom security provider subclasses from OpenAPI `securitySchemes`.
  - Apply root-level and operation-level security requirements to generated frames.
  - Allow overriding provider class names and import paths per security scheme.

## generator-core

### Testing

- [ ] Local packaged CLI smoke test
  - Verify the full `frame-cli create` pipeline against a local Swagger/OpenAPI fixture after `@jin-frame/generator-core` runtime bundles are available.
  - Target flow: `load -> validate -> convertor -> createOpenapiTs -> createFrames -> write files`.
  - Do not depend on external public APIs or remote Swagger documents.
- [x] Generated output compilation check (response-union integration test)
  - Generate frames into a temporary directory and run `tsc --noEmit` against the output.
- [ ] Schema composition smoke coverage
  - Ensure frame generation does not crash for request/response schemas using `allOf`, `oneOf`, and `anyOf`.
  - Type expansion correctness is delegated to `openapi-typescript`.
  - Multi-server specs with mixed absolute and relative URLs.
  - Specs with no `servers` field.

### Optional Convenience

- [ ] Barrel file generation
  - Optionally generate `index.ts` in each tag directory for grouped imports.
  - Generated clients are still usable through direct frame file imports.

### Completed

- [x] Relative server URL behavior documentation
  - `hostStrategy: "string"` with a relative server URL treats the value as a path prefix when possible.
  - The behavior is documented in the generator CLI and core package READMEs.
- [x] OpenAPI `integer` + `format: int64` string mapping
  - `--int64-as-string` maps OpenAPI `integer` schemas with `format: int64` / `i64` to `string`.
  - The mapping is applied through `openapi-typescript` schema transforms, so nested `ObjectBody` fields are covered by generated `paths.d.ts` types.
- [x] Swagger/OpenAPI v2 conversion
  - Swagger v2 documents are validated and converted to OpenAPI v3 through `convertor()`.
- [x] `specTypeFilePath` vs `specFilePath`
  - `specTypeFilePath` is used for generated type imports.
  - `specFilePath` is accepted separately and used for source spec URL/host resolution.
- [x] Clean dependency direction
  - `generator-core` does not reference `generator-cli` option types.
  - CLI parses its own options and passes plain core options into `createFrames()`.
- [x] OpenAPI TypeScript rendering
  - `createOpenapiTs()` returns TypeScript source as a string using the renderer provided by `openapi-typescript`.
- [x] Endpoint override generation
  - `timeouts[path]`, `retries[path]`, and `hosts[path]` are accepted by `createFrames()`.
  - CLI parses repeated override args and `frame-cli.config.*` into the same object shape.
- [x] Native fetch for URL spec loading
  - `generator-core` no longer depends on `axios` for loading remote OpenAPI documents.
