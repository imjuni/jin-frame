# generator-core TODO

## Critical (broken code)

- [ ] **`generator-cli/createCommandHandler.ts`** still imports deleted `printOpenapiTs` — replace with `renderOpenapiTs`
- [ ] **`getHost()` concept fix** — `specTypeFilePath` is the generated `.d.ts` path, not the source OpenAPI spec path; host resolution should use the original spec file path instead

## Missing Features

- [ ] **Barrel file generation** — generate `index.ts` in each tag directory after frame files are written (required for practical usability)
- [ ] **`IGeneratorOption` dependency** — `generator-core` must not reference `generator-cli` types; keep a clean dependency direction (cli depends on core, not vice versa)

## Testing

- [ ] **CLI end-to-end test** — verify the full pipeline: `load → validate → convertor → createOpenapiTs → renderOpenapiTs → createFrames → write files`
- [ ] **Compilation check** — verify generated frame files compile without errors (e.g. using `tsc --noEmit` on the output directory)
- [ ] **Edge case coverage**
  - Endpoints with no parameters
  - `allOf` / `oneOf` / `anyOf` schema types
  - Multi-server specs with mixed absolute/relative URLs
  - Specs with no `servers` field

## Design Concerns

- [ ] **`specTypeFilePath` vs `specFilePath`** — consider accepting both: `specTypeFilePath` for import path generation, `specFilePath` (the original `.json`/`.yaml`) for host resolution
- [ ] **`hostStrategy: 'string'` with relative server URL** — currently embeds `/api/v3` as the host literal, which may surprise users; consider warning or documentation
