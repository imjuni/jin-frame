# generator-core TODO

## Remaining Features

- [ ] **Barrel file generation**
  - Generate `index.ts` in each tag directory after frame files are written.
  - This is required for practical imports from generated clients.

## Testing

- [ ] **Packaged CLI smoke test**
  - Verify the full `jin-frame-generator create` pipeline against a local Swagger/OpenAPI document after `@jin-frame/generator-core` runtime bundles are available.
  - Target flow: `load -> validate -> convertor -> createOpenapiTs -> printOpenapiTs -> createFrames -> write files`.
  - Current source-level attempt is blocked when `@jin-frame/generator-core/dist/cjs/index.cjs` is not built locally.
- [ ] **Generated output compilation check**
  - Generate frames into a temporary directory and run `tsc --noEmit` against the output.
- [ ] **Schema edge case coverage**
  - `allOf` / `oneOf` / `anyOf` schema types.
  - Multi-server specs with mixed absolute and relative URLs.
  - Specs with no `servers` field.

## Design Follow-up

- [ ] **Relative server URL behavior**
  - `hostStrategy: "string"` with a relative server URL currently treats the value as a path prefix when possible.
  - Add explicit documentation or a warning if this behavior is surprising in generated output.

## Completed

- [x] **Swagger/OpenAPI v2 conversion**
  - Swagger v2 documents are validated and converted to OpenAPI v3 through `convertor()`.
- [x] **`specTypeFilePath` vs `specFilePath`**
  - `specTypeFilePath` is used for generated type imports.
  - `specFilePath` is accepted separately and used for source spec URL/host resolution.
- [x] **Clean dependency direction**
  - `generator-core` does not reference `generator-cli` option types.
  - CLI parses its own options and passes plain core options into `createFrames()`.
- [x] **`printOpenapiTs` compatibility**
  - `printOpenapiTs` exists as an alias of `renderOpenapiTs`.
- [x] **Endpoint override generation**
  - `timeouts[path]`, `retries[path]`, and `hosts[path]` are accepted by `createFrames()`.
  - CLI parses repeated override args and `jin-frame.config.*` into the same object shape.
- [x] **Native fetch for URL spec loading**
  - `generator-core` no longer depends on `axios` for loading remote OpenAPI documents.
