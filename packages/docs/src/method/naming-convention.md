---
outline: deep
---

# Naming conventions

Instance framework operations begin with `_` so endpoint fields can use ordinary API names. Static construction methods remain `of()` and `builder()`.

| Method | Role |
| --- | --- |
| `Frame.of()` / `Frame.of(fields)` | Construct an instance; no network request. |
| `Frame.builder()` | Configure typed public fields. |
| `_request()` | Build request configuration synchronously. |
| `_create()` | Return an executable requester. |
| `_execute()` | Resolve async authorization and send. |
| `_preHook`, `_postHook` | Override lifecycle behavior. |
| `_getOption`, `_getData` | Inspect configured and collected state. |

## Public field names

Methods, private/protected fields, and underscore-prefixed fields are excluded from factory/builder inputs. Use `replaceAt` to map a convenient TypeScript name to a wire name. Do not rename framework methods in generated code.

## Older examples

Current examples use native fetch, `_execute()`, and one status/data response union. The obsolete `execute()` and Either-style result patterns belong only in migration history. See [migration](../migration-v6).
