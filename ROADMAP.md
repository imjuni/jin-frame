# Roadmap

## jin-frame

- [ ] Mocking (Provide built-in mock functionality without using axios-mock-adapter)
  - Support registering mocks as an array
  - Each array element follows the format: { url: string; params: self, reply: unknown }
    - params refers to the type. When checking cache matches, passing member variables will also match those values
  - When executing or making requests, iterate through the array to return responses
- [ ] Add BigInt type (Long type) serialization functionality
- [ ] Implement caching functionality using endpoint and query
  - Calculate cache timeout and re-execute when timeout expires, otherwise return cached result
  - Explore cache strategies like stale-while-revalidate (similar to SWR)
  - Research cache-related headers
- [ ] Create a simple server with fastify for testing file uploads and other features
- [ ] Powerful cache layer (memory/LRU)
- [ ] Upload/download progress events
- [ ] Add functionality to change Authorization and host after Server Component configuration for convenient use in Next.js
- [ ] Status code and content type specific response models
  - OpenAPI responses are defined by `status-code + content-type -> response schema`.
  - Support distinct success and failure DTOs by status code and content type without losing OpenAPI contract information.
  - Keep the simple user-facing path ergonomic, while preserving an advanced response map for OpenAPI-driven generation and typed error handling.

### Feasibility Study

- [ ] Powerful cache layer (IndexedDB/AsyncStorage)
- [ ] Authentication templates (plugin-like integration, feasibility assessment needed for both node + browser compatibility)
- [ ] Multi-transport adapters (Edge/Node/Deno/React Native, axios uses adapter approach, feasibility study needed, though axios alone seems sufficient)
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
  - Target flow: `load -> validate -> convertor -> createOpenapiTs -> renderOpenapiTs -> createFrames -> write files`.
  - Do not depend on external public APIs or remote Swagger documents.
- [ ] Generated output compilation check
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
- [ ] Relative server URL behavior documentation
  - `hostStrategy: "string"` with a relative server URL currently treats the value as a path prefix when possible.
  - Add explicit documentation or a warning if this behavior is surprising in generated output.

### Completed

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
  - `renderOpenapiTs` renders the TypeScript AST returned by `createOpenapiTs()`.
- [x] Endpoint override generation
  - `timeouts[path]`, `retries[path]`, and `hosts[path]` are accepted by `createFrames()`.
  - CLI parses repeated override args and `frame-cli.config.*` into the same object shape.
- [x] Native fetch for URL spec loading
  - `generator-core` no longer depends on `axios` for loading remote OpenAPI documents.
