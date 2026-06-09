# generator-core TODO

## Testing

- [ ] **Local packaged CLI smoke test**
  - Verify the full `frame-cli create` pipeline against a local Swagger/OpenAPI fixture after `@jin-frame/generator-core` runtime bundles are available.
  - Target flow: `load -> validate -> convertor -> createOpenapiTs -> renderOpenapiTs -> createFrames -> write files`.
  - Do not depend on external public APIs or remote Swagger documents.
- [ ] **Generated output compilation check**
  - Generate frames into a temporary directory and run `tsc --noEmit` against the output.
- [ ] **Schema composition smoke coverage**
  - Ensure frame generation does not crash for request/response schemas using `allOf`, `oneOf`, and `anyOf`.
  - Type expansion correctness is delegated to `openapi-typescript`.
  - Multi-server specs with mixed absolute and relative URLs.
  - Specs with no `servers` field.

## Optional Convenience

- [ ] **Barrel file generation**
  - Optionally generate `index.ts` in each tag directory for grouped imports.
  - Generated clients are still usable through direct frame file imports.
- [ ] **Relative server URL behavior documentation**
  - `hostStrategy: "string"` with a relative server URL currently treats the value as a path prefix when possible.
  - Add explicit documentation or a warning if this behavior is surprising in generated output.

## Completed

- [x] **OpenAPI `integer` + `format: int64` string mapping**
  - `--int64-as-string` maps OpenAPI `integer` schemas with `format: int64` / `i64` to `string`.
  - The mapping is applied through `openapi-typescript` schema transforms, so nested `ObjectBody` fields are covered by generated `paths.d.ts` types.
- [x] **Swagger/OpenAPI v2 conversion**
  - Swagger v2 documents are validated and converted to OpenAPI v3 through `convertor()`.
- [x] **`specTypeFilePath` vs `specFilePath`**
  - `specTypeFilePath` is used for generated type imports.
  - `specFilePath` is accepted separately and used for source spec URL/host resolution.
- [x] **Clean dependency direction**
  - `generator-core` does not reference `generator-cli` option types.
  - CLI parses its own options and passes plain core options into `createFrames()`.
- [x] **OpenAPI TypeScript rendering**
  - `renderOpenapiTs` renders the TypeScript AST returned by `createOpenapiTs()`.
- [x] **Endpoint override generation**
  - `timeouts[path]`, `retries[path]`, and `hosts[path]` are accepted by `createFrames()`.
  - CLI parses repeated override args and `frame-cli.config.*` into the same object shape.
- [x] **Native fetch for URL spec loading**
  - `generator-core` no longer depends on `axios` for loading remote OpenAPI documents.
