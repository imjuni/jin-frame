# Claude

---

## Project Overview

**`jin-frame`** is a library that allows you to define **HTTP Requests** as **TypeScript Classes**.

It goes beyond simply defining requests by providing a variety of features frequently required in real-world applications. For example, you can configure hooks, set timeouts, and specify retry counts differently per endpoint. All of these configurations are expressed declaratively through TypeScript classes. The ultimate goal is to help you **manage APIs more effectively**.

The project is structured as a pnpm monorepo:

Monorepo structure: pnpm workspace with packages under packages/
Core library: packages/jin-frame/ contains the main library implementation
Generator Core library: A library that automatically generates jin-frame using OpenAPI specification documents
CLI integration: packages/generator-cli/ A CLI application that automatically generates jin-frame using OpenAPI specification documents
Package management: Uses pnpm for Node.js development and dependency management
Build tool: Uses esbuild for TypeScript compilation and distribution

## Architecture

## Directory Sturcture

```text
packages/
├── jin-frame/          # Main library
│   ├── src/
│   │   ├── frames/     # frame related class
│   │   ├── decorators/ # decorators
│   │   ├── tools/      # misc utility
│   │   └── processors/ # request parameter processors
│   └── package.json
├── generator-cli/      # jin-frame generator cli
└── generator-core/     # jin-frame generator core library
```

### jin-frame

### generator-cli

### generator-core

## Development commands

### Testing

pnpm run test — Run tests using vitest
pnpm --filter jin-frame run test — Run tests across all packages using pnpm

### Build and Development

pnpm --filter jin-frame run build - Run build command jin-frame

## Testcase

### Testcase Naming

- Use BDD (Behavior-Driven Development) style guidelines
- Write testcase names in "should ... when ..." format
- All testcase names must be written in English
- Focus on behavior rather than implementation details
- Keep test cases concise and avoid over-testing already proven functionality (e.g., JSON.stringify)

### Example Test Cases

```typescript
// Good: BDD style with clear behavior description
it('should return stringified JSON when serialization succeeds', () => {
  // test implementation
});

it('should return undefined when serialization fails', () => {
  // test implementation
});

// Good: Cache key generation test
it('should generate correct cache key when frame has query excluded from cache', () => {
  // test implementation
});

// Good: Request deduplication test
it('should increment response count when multiple requests are made', () => {
  // test implementation
});
```

## Commit

### Commit Log

- Use Conventional Commit format
- First line must not exceed 50 characters
- All commit messages must be written in English
- Include comprehensive description of changes in commit body

### Example Commit

```text
feat(dedupe): add request deduplication system

- Add @Dedupe decorator for method-level request deduplication
- Implement RequestDedupeManager with wrapper-based result tracking
- Add cacheKeyExclude and cacheKeyExcludePaths options for cache control
- Refactor field option processors into modular structure
- Add comprehensive test coverage for new features
- Create utility functions for cache key generation and JSON handling

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
