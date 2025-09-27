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
├── jin-frame/              # Main library
│   ├── src/
│   │   ├── decorators/     # HTTP method and field decorators
│   │   │   ├── fields/     # Field decorators (@Query, @Body, etc.)
│   │   │   └── methods/    # HTTP method decorators (@Get, @Post, etc.)
│   │   ├── frames/         # Core frame classes and request management
│   │   ├── processors/     # Request parameter processors
│   │   │   └── default-option/  # Default option processors
│   │   ├── interfaces/     # TypeScript interface definitions
│   │   │   ├── field/      # Field-related interfaces
│   │   │   └── options/    # Configuration option interfaces
│   │   ├── tools/          # Utility functions and helpers
│   │   │   ├── auth/       # Authentication utilities
│   │   │   ├── encodes/    # Encoding/decoding utilities
│   │   │   ├── formatters/ # Data formatters
│   │   │   ├── json/       # JSON handling utilities
│   │   │   ├── responses/  # Response processing utilities
│   │   │   ├── slash-utils/ # URL path utilities
│   │   │   ├── type-narrowing/ # Type narrowing utilities
│   │   │   └── type-utilities/ # TypeScript type utilities
│   │   ├── exceptions/     # Custom exception classes
│   │   ├── validators/     # Request/response validators
│   │   └── __tests__/      # Test utilities and fixtures
│   └── package.json
├── generator-cli/          # CLI for generating jin-frame code
│   ├── src/
│   │   ├── commands/       # CLI command implementations
│   │   ├── builders/       # Code generation builders
│   │   ├── handlers/       # Command handlers
│   │   ├── transforms/     # Data transformation utilities
│   │   ├── validators/     # Input validation
│   │   └── interfaces/     # CLI-specific interfaces
│   └── package.json
└── generator-core/         # Core library for code generation
    ├── src/
    │   ├── generators/     # Code generation logic
    │   │   ├── content-type/ # Content-type handling
    │   │   ├── hosts/      # Host/URL generation
    │   │   ├── json/       # JSON schema processing
    │   │   ├── octet-stream/ # File upload handling
    │   │   └── parameters/ # Parameter processing
    │   ├── openapi/        # OpenAPI specification parsing
    │   ├── https/          # HTTP utilities
    │   └── tools/          # Generation utilities
    └── package.json
```

### jin-frame

The core library providing a declarative HTTP API request framework. This package allows developers to define HTTP requests as TypeScript classes using decorators, making API management more structured and maintainable.

**Key Features:**

- **Declarative API Definition**: Define HTTP requests using TypeScript classes and decorators
- **Type Safety**: Full TypeScript support with strong typing for requests and responses
- **Middleware Support**: Pre/post hooks for request processing
- **Request Deduplication**: Automatic deduplication of identical concurrent requests
- **Retry Logic**: Configurable retry mechanisms with exponential backoff
- **Validation**: Built-in request/response validation
- **Authentication**: Support for various authentication methods
- **Error Handling**: Comprehensive error handling with custom exception types

**Main Exports:**

- Frame classes (`JinFrame`, `JinEitherFrame`, `AbstractJinFrame`)
- HTTP method decorators (`@Get`, `@Post`, `@Put`, `@Delete`, etc.)
- Field decorators (`@Query`, `@Body`, `@Param`, `@Header`, etc.)
- Validation and authentication utilities

### generator-cli

A command-line interface tool for automatically generating jin-frame classes from OpenAPI specifications. This tool bridges the gap between API documentation and implementation by creating type-safe jin-frame classes.

**Key Features:**

- **OpenAPI Integration**: Generates jin-frame classes from OpenAPI 3.x specifications
- **Type Generation**: Creates TypeScript interfaces and classes with full type safety
- **Customizable Output**: Configurable code generation templates and output structure
- **Multiple Formats**: Supports YAML and JSON OpenAPI specifications
- **CLI Interface**: Easy-to-use command-line interface with comprehensive options

**Main Dependencies:**

- OpenAPI specification parsing and validation
- Code generation and formatting utilities
- File system operations and path handling

### generator-core

The core library powering the code generation functionality. This package contains the business logic for parsing OpenAPI specifications and generating corresponding jin-frame classes, making it reusable across different interfaces (CLI, web, etc.).

**Key Features:**

- **OpenAPI Parsing**: Robust parsing of OpenAPI 3.x specifications
- **Code Generation Engine**: Template-based code generation for TypeScript classes
- **Schema Processing**: Converts OpenAPI schemas to TypeScript interfaces
- **Parameter Mapping**: Maps OpenAPI parameters to jin-frame decorators
- **Content-Type Handling**: Supports various content types (JSON, form-data, octet-stream)
- **Host Resolution**: Handles server URLs and path generation
- **Modular Architecture**: Separate generators for different aspects (parameters, content-types, etc.)

**Core Components:**

- **Generators**: Specialized code generators for different OpenAPI components
- **OpenAPI Tools**: Utilities for parsing and validating OpenAPI documents
- **Template System**: Flexible template system for code generation
- **Type Utilities**: Helper functions for TypeScript type generation

This package serves as the foundation for both the CLI tool and any future code generation interfaces.

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
