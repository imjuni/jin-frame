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

### Core Framework Architecture

#### Frame Classes Hierarchy

- **AbstractJinFrame**: Base class handling request building, parameter processing, authentication, and caching
- **JinFrame**: Main implementation returning AxiosResponse directly with comprehensive error handling
- **JinEitherFrame**: ⚠️ **DEPRECATED** - Legacy implementation using Either pattern (use JinFrame instead)

#### Key Components

**Decorators System**:

- HTTP Methods: `@Get`, `@Post`, `@Put`, `@Delete`, `@Patch`, etc.
- Field Decorators: `@Query`, `@Body`, `@Param`, `@Header`, `@ObjectBody`
- Configuration: `@Retry`, `@Timeout`, `@Dedupe`, `@Validator`

**Security Providers** (`packages/jin-frame/src/providers/security/`):

- `BearerTokenProvider` - HTTP Bearer token authentication
- `ApiKeyProvider` - API key authentication (header, query, cookie)
- `BasicAuthProvider` - HTTP Basic authentication
- `OAuth2Provider` - OAuth2 token authentication
- Support for multiple security providers per request

**Request Processing Pipeline**:

1. Decorator metadata collection (`decorators/methods/handlers/`)
2. Parameter processing (`processors/`)
3. Authentication application (`tools/auth/`)
4. Request deduplication (`frames/RequestDedupeManager`)
5. Retry logic with exponential backoff
6. Response validation and error handling

**Authentication & Authorization**:

- Static authorization configured at class level
- Dynamic authorization via `dynamicAuth` parameter in execute() method
- Security providers create appropriate headers/parameters based on auth data

### Directory Structure

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

- Frame classes (`JinFrame`, `AbstractJinFrame`, ~~`JinEitherFrame`~~ - deprecated)
- HTTP method decorators (`@Get`, `@Post`, `@Put`, `@Delete`, etc.)
- Field decorators (`@Query`, `@Body`, `@Param`, `@Header`, etc.)
- Security providers (`BearerTokenProvider`, `ApiKeyProvider`, `BasicAuthProvider`, `OAuth2Provider`)
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

## Development Commands

### Testing

```bash
# Run all tests with coverage
pnpm --filter jin-frame test

# Run specific test file
pnpm --filter jin-frame test src/frames/JinFrame.test.ts

# Run security tests
pnpm --filter jin-frame test src/__tests__/security.test.ts

# Run tests for specific package
pnpm --filter generator-cli test
```

### Building

```bash
# Build jin-frame package
pnpm --filter jin-frame run build

# Bundle for distribution (includes clean, TypeScript compilation, and ESM/CJS builds)
pnpm --filter jin-frame run bundle

# Generate type definitions
pnpm --filter jin-frame run dts-pack
```

### Linting & Code Quality

```bash
# Lint code
pnpm --filter jin-frame run lint

# Run lint-staged for pre-commit
pnpm --filter jin-frame run lint-staged
```

### Documentation

```bash
# Start VitePress dev server
pnpm --filter jin-frame run docs:dev

# Build documentation
pnpm --filter jin-frame run docs:build

# Generate TypeDoc documentation
pnpm --filter jin-frame run docs:typedoc
```

## Development Patterns

### Frame Class Definition

```typescript
@Get({
  host: 'https://api.example.com',
  path: '/users/:id',
  security: new BearerTokenProvider(),
  authorization: 'default-token'
})
class UserFrame extends JinFrame<UserResponse> {
  @Param()
  declare public readonly id: string;

  @Query()
  declare public readonly include?: string;
}
```

### Request Execution

```typescript
// Static authorization (from decorator)
const user = await frame.execute();

// Dynamic authorization (override at runtime)
const user = await frame.execute({
  dynamicAuth: 'runtime-token'
});
```

### Security Provider Usage

```typescript
// Single security provider
@Get({
  host: 'https://api.example.com',
  security: new BearerTokenProvider(),
  authorization: 'my-token'
})

// Multiple security providers
@Get({
  host: 'https://api.example.com',
  security: [
    new BearerTokenProvider(),
    new ApiKeyProvider('client-id', 'X-Client-ID', 'header')
  ],
  authorization: 'multi-auth-token'
})

// OAuth2 Provider (note: accessToken, not access_token)
@Get({
  security: new OAuth2Provider('oauth2', 'Bearer'),
  authorization: { accessToken: 'token-xyz', tokenType: 'Bearer' }
})
```

## Migration Guide

### JinEitherFrame → JinFrame Migration

**⚠️ JinEitherFrame is deprecated and will be removed in future versions. Migrate to JinFrame.**

#### Changes Required

1. **Class Declaration**:

```typescript
// Before
class MyFrame extends JinEitherFrame { }

// After
class MyFrame extends JinFrame { }
```

1. **Import Statement**:

```typescript
// Before
import { JinEitherFrame } from 'jin-frame';

// After
import { JinFrame } from 'jin-frame';
```

1. **Response Handling**:

```typescript
// Before (Either pattern)
const result = await frame.execute();
if (result.pass) {
  console.log(result.pass.data);
} else {
  console.error(result.fail);
}

// After (Direct AxiosResponse)
try {
  const result = await frame.execute();
  console.log(result.data);
} catch (error) {
  console.error(error.resp);
}
```

1. **Test Assertions**:

```typescript
// Before
expect(result.pass).toBeDefined();
expect(result.pass?.data).toEqual(expectedData);

// After
expect(result.status).toBe(200);
expect(result.data).toEqual(expectedData);

// For error cases
await expect(frame.execute()).rejects.toMatchObject({
  resp: { status: 401 }
});
```

1. **Remove Either-related imports**:

```typescript
// Remove these imports
import { isPass, isFail } from 'my-only-either';
```

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

// Good: Security provider test
it('should authenticate with Bearer token when valid token provided', () => {
  // test implementation
});

it('should throw authentication error when invalid token provided', () => {
  // test implementation
});
```

### Security Testing Guidelines

When testing security providers and authentication:

1. **Use MSW for HTTP mocking**: Mock authentication endpoints with different response scenarios
2. **Test both success and failure cases**: Cover valid/invalid tokens, missing auth, etc.
3. **Test JinFrame error handling**: Use `expect().rejects.toMatchObject()` for error scenarios
4. **OAuth2 Provider specifics**: Use `accessToken` (camelCase) not `access_token` in authorization objects
5. **Dynamic auth testing**: Test `dynamicAuth` parameter override functionality

```typescript
// Example security test pattern
it('should authenticate with OAuth2 provider when valid access token provided', async () => {
  @Get({
    host: 'http://api.example.com/profile',
    security: new OAuth2Provider('oauth2', 'Bearer'),
    authorization: { accessToken: 'valid-token', tokenType: 'Bearer' }
  })
  class TestFrame extends JinFrame {}

  const frame = new TestFrame();
  const result = await frame.execute();

  expect(result.status).toBe(200);
  expect(result.data).toEqual(expectedUserProfile);
});

it('should handle authentication failure when invalid token provided', async () => {
  @Get({
    host: 'http://api.example.com/profile',
    security: new BearerTokenProvider(),
    authorization: 'invalid-token'
  })
  class TestFrame extends JinFrame {}

  const frame = new TestFrame();

  await expect(frame.execute()).rejects.toMatchObject({
    resp: { status: 401 }
  });
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
