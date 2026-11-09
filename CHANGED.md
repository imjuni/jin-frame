# Changed

Release history and consumer migration notes are maintained in this file. See [compatibility and migration](#compatibility-and-migration) for before/after examples and the [6.0 guide](./packages/docs/src/migration-v6.md) for design rationale.

## 6.0.0

- Fixed generator host fallback when OpenAPI servers is absent or empty: use the remote specification origin rather than treating the document path as an API prefix. Explicit host and server prefixes remain unchanged.

The manifests target jin-frame 6.0.0 and generator CLI/core 1.0.0. This section describes repository changes and does not assert npm publication.

- Replace Pass/Fail body generics with a single status/data response union, preserving the relationship between each numeric HTTP status and its payload.
- Infer declared 2xx responses by default. Configure acceptance per call with the typed `validateStatus(...)` helper or a boolean callback; decorator-level status policies are removed.
- Replace pass/fail validators with a single `validator`. `BaseValidator<Replies, TError>` passes the complete response through `getData()` and `validator()` so application code can choose schemas by status. Keep HTTP error precedence and preserve HTTP context when validation throws.
- Preserve absent HTTP responses as `resp: undefined`, retain original causes, isolate deduplicated requests, stop cancelled retries, and track execution timestamps per execution.
- Move the shared English/Korean guides and both TypeDoc references into the private `@jin-frame/docs` workspace.
- Content-type-specific response discrimination remains future work; generated payload types currently combine media types for each numeric status.

## Generator 1.0.0

### Generator CLI

- Added the `frame-cli create` command to generate `paths.d.ts`, base frames, request frames, and security providers from Swagger/OpenAPI v2 and OpenAPI v3 documents.
- Added the `frame-cli frame` command to generate frames from an existing `openapi-typescript` declaration file.
- Published the CLI as an ESM executable-only package without a library API or declaration bundle.
- Added config file loading, endpoint host/timeout/retry overrides, OpenAPI TypeScript option forwarding, and `int64`-to-string mapping.
- Added `string`, `function`, and `env-function` host strategies.
- Added executable package output, scoped public publishing metadata, package licenses, and generator CI coverage.
- Fixed octet-stream generation to emit and import the `Body` decorator consistently.

### Generator Core

- Added reusable OpenAPI loading, validation, v2-to-v3 conversion, type generation, and frame generation APIs.
- Published the core library as ESM-only with bundled TypeScript declarations.
- Added request parameter, body, response, file upload, server variable, and host generation.
- Added generated or application-provided security providers for API key, HTTP Bearer, and HTTP Basic schemes.
- Added root-level and operation-level OpenAPI security requirement mapping.
- Normalized CommonJS validator interop for the ESM runtime bundle.

## 5.1.0

### New Features in 5.1.0

- **Runtime URL overrides in `JinFrameRequestConfig`**: `_execute()` / `_create()` can now override `host`, `pathPrefix`, and `path` at request time.
  - This makes it possible to reuse the same frame class across environments, tenants, or server component flows without rebuilding the frame definition.
  - Runtime URL overrides are covered by `AbstractJinFrame` tests.
- **Node.js 20 compatibility**: `jin-frame` runtime bundles and type-checking target Node.js 20, with dedicated CI coverage.

## 5.0.4

### Bug Fixes in 5.0.4

- **Inherited field metadata lookup**: Field metadata resolution now traverses the prototype chain.
  - Decorated fields declared on parent frame classes are correctly discovered by child classes.
  - Override behavior is covered by dedicated inheritance tests.

### Infrastructure in 5.0.4

- **Silent test scripts**: Added silent-mode test scripts and wired the pre-commit hook to use the quieter test command.

## 5.0.3

### New Features in 5.0.3

- **`validateStatus` support in `FrameOption`**: `validateStatus` can now be configured through the frame-level option decorator, not only method-level options.

### Documentation and Code Quality in 5.0.3

- **English comments**: Internal comments were normalized to English for open-source maintainability.
- **Type utility cleanup**: Removed obsolete builder-related helper types after the v5 type-system refactor.

## 5.0.2

### Bug Fixes in 5.0.2

- **Safe JSON parsing fallback**: `safeParse()` now returns the original raw string when `JSON.parse()` fails instead of losing the response body shape.
  - This improves handling for text responses and malformed JSON payloads.

## 5.0.1

### Bug Fixes in 5.0.1

- **OAuth2 cleanup after v5 removal**: Removed remaining OAuth2 references after `OAuth2Provider` was removed in 5.0.0.
- **Multipart PUT/PATCH support**: Multipart request handling now covers PUT and PATCH flows in addition to the existing form upload paths.
- **Axios reference cleanup**: Remaining Axios-era names and documentation references were cleaned up after the native fetch migration.

### Documentation in 5.0.1

- **Naming convention documentation**: Added naming convention pages in both Korean and English, with updated cross-references from inheritance documentation.

## 5.0.0

### Breaking Changes in 5.0.0

- **Axios removed — native fetch**: `axios` and all axios-related types have been removed. HTTP requests now use the native `fetch` API. `JinRequestConfig` no longer extends `AxiosRequestConfig`; response objects wrap native `Response`.
- **`JinEitherFrame` removed**: `JinEitherFrame` and the `my-only-either` dependency are gone. Use `JinFrame<Pass, Fail>` directly. The discriminated-union response (`ok: true` / `ok: false`) replaces the Either pattern.
- **RFC 6570 URI Template syntax**: Path parameters now follow RFC 6570 (`{param}`) instead of path-to-regexp (`:param`). Example: `path: '/users/{id}'` replaces `path: '/users/:id'`.
- **Interface and type prefix removed**: All `I`-prefixed interfaces and `T`-prefixed types have been renamed. For example, `IJinFrameRequestConfig` → `JinFrameRequestConfig`, `TMethod` → `Method`.
- **`validator` option replaced by `validators`**: The single `validator` option on `@Get`/`@Post`/etc. is replaced by `validators: { pass?: BaseValidator; fail?: BaseValidator }`. Pass and fail responses are validated independently.
- **`valid` and `$validated` are non-nullable**: Both `JinPassResp` and `JinFailResp` now always carry `valid: boolean` and `$validated: ValidationResult`. When no validator is configured, `valid` defaults to `true`.
- **Fail validator never throws `JinValidationError`**: Fail validators only set `valid`/`$validated` on the response. `JinValidationError` is only thrown for pass-path validation failures.
- **`validateStatus` signature changed**: `validateStatus` now receives `(ok: boolean, status: number)` instead of `(status: number)`. `isValidateStatusDefault` delegates to `ok` directly instead of comparing against a status threshold.
- **`@Authorization` decorator removed**: `@Authorization` is gone. Pass the security key as the second argument to `@Security` instead. Example: `@Security(new BearerTokenProvider(), 'my-token')` replaces the separate `@Authorization('my-token')`.
- **`OAuth2Provider` removed**: `OAuth2Provider` has been removed. Use `BearerTokenProvider` for OAuth2 Bearer token scenarios. For Swagger/OpenAPI documentation generation, `BearerTokenProvider` now covers the use-cases previously handled by `OAuth2Provider`.

### New Features in 5.0.0

- **`SecurityKey` — lazy / async key resolution**: The new `SecurityKey` type (`string | (() => string | Promise<string>)`) allows the authorization value to be supplied as a plain string or a function that returns one (synchronously or asynchronously). This enables secrets to be fetched at request time from dotenv, HashiCorp Vault, or any other async secret source.
  ```ts
  @Get({
    host: 'https://api.example.com',
    security: new BearerTokenProvider(),
    authorization: async () => await vault.getSecret('api-token'),
  })
  class SecureFrame extends JinFrame<Response> {}
  ```
- **`BearerTokenProvider.setKey()`**: Allows the Bearer token to be updated at runtime (e.g. after a token refresh) without reconstructing the provider instance.
- **`JinFrame.builder()` — phantom-type Builder pattern**: New static `builder()` method returns a `BuilderFor<C>` that tracks which fields have been set via TypeScript phantom types. `build()` is only callable once all public fields are set.
  ```ts
  const frame = MyFrame.builder()
    .set('userId', 1)
    .set('name', 'Alice')
    .build();
  ```
- **`JinFrame.of()` — object or builder callback**: New static `of()` creates an instance from a plain object or a builder callback.
  ```ts
  const frame = MyFrame.of({ userId: 1, name: 'Alice' });
  const frame2 = MyFrame.of(b => b.set('userId', 1).set('name', 'Alice'));
  ```
- **Constructor arguments in `builder()` / `of()`**: Classes with constructor parameters are fully supported — extra arguments are forwarded to the constructor via `ConstructorParameters<C>`.
- **`@Cookie` decorator**: New decorator to set the `Cookie` request header from a field value.
- **`AbortSignal` support**: `_execute()` and `_create()` now accept an `AbortSignal` through `JinFrameRequestConfig` for request cancellation.
- **`raw` response field**: `JinRespBase` exposes the native `Response` object as `raw` (optionally cloned via `cloneRaw` option) for access to streaming or raw binary data.
- **Custom `deserialize` option**: `_execute()` / `_create()` accept a `deserialize(text: string): unknown` function to override the default JSON parser.

### Type System Improvements in 5.0.0

- **`PublicFieldsOf<T>`**: Mapped type that extracts only public, non-function, non-`_`-prefixed fields from a class. Used to give `builder()` and `of()` precise field constraints.
- **`BuilderFor<C, TSet>`**: Phantom-type builder interface that accumulates the set of assigned keys as a type parameter, enabling compile-time completeness checking.
- **`WithDefaultValues<C>` / `WithBuilder<C>`**: Extracted interfaces for internal static method casting — follows Single File Single Responsibility.
- **`AbstractConstructorFunction<C>`**: Companion to `ConstructorFunction<C>` for abstract class constructors.

### Infrastructure in 5.0.0

- **TypeScript 6.0.3**: Project upgraded to TypeScript 6.0.3.
  - `ignoreDeprecations: "6.0"` added to `tsconfig.json` for the deprecated `baseUrl` option (to be removed in a follow-up migration).
  - `rollup-plugin-dts` → `^6.4.1` (adds TS 6.x peer dep support).
  - `@stylistic/eslint-plugin` → `^5.10.0`, `typescript-eslint` → `^8.59.0`, `typedoc` → `^0.28.19`.
- **`pnpm` catalog**: Workspace-level TypeScript catalog entry updated to `6.0.3`.

## 4.8.0

### New Features in 4.8.0

- **Request Deduplication System**: Advanced request deduplication functionality
  - `@Dedupe` decorator: Automatic detection and prevention of duplicate requests
  - `RequestDedupeManager`: Centralized management of concurrent request deduplication
  - Configurable cache key generation with flexible exclude options
  - `DedupeResult` interface with `isDeduped` property for enhanced debugging and monitoring
  - Comprehensive deduplication documentation and internationalization support
- **Security and Authorization System**: Comprehensive security framework implementation
  - `@Security` decorator: Declarative security configuration for request methods
  - `@Authorization` decorator: Enhanced authorization handling with flexible configuration
  - Security provider system: Pluggable security providers for various authentication schemes
  - Authorization field support: Backward compatible authorization field configuration
  - Comprehensive security documentation in both Korean and English
- **Enhanced Documentation Infrastructure**: Major improvements to documentation system
  - Mermaid diagram support in VitePress documentation for better visual explanations
  - Git hooks initialization script for improved development workflow
  - Enhanced project structure documentation with detailed package descriptions

### Request Deduplication in 4.8.0

- **Cache Key Generation**: Core mechanism for identifying duplicate requests
  - Generates unique cache keys by combining endpoint and parameters to determine request identity
  - Duplicate requests with identical cache keys share the first request's response
  - `cacheKeyExclude` option for excluding specific fields from cache key generation
  - `cacheKeyExcludePaths` option for excluding nested object paths
  - Support for excluding dynamic fields like timestamps, UUIDs, and request IDs that change per request but shouldn't affect deduplication
- **Advanced Deduplication Logic**: Sophisticated duplicate request handling
  - Wrapper-based result tracking with `DedupeResult` interface
  - Automatic cleanup of completed requests from pending cache
  - Error handling with independent retry logic for failed requests
  - Memory-based deduplication with application lifecycle management
- **Developer Tools**: Enhanced debugging and monitoring capabilities
  - `RequestDedupeManager` utility methods for monitoring pending requests
  - Debug information with `isDeduped` property in response objects
  - Comprehensive test coverage for deduplication scenarios
  - Performance monitoring and network traffic reduction analytics

### Security Framework in 4.8.0

- **Security Provider Architecture**: Flexible and extensible security system
  - Abstract security provider base class for custom implementations
  - Built-in support for common authentication schemes
  - Type-safe security configuration with TypeScript integration
  - Runtime security validation and error handling
- **Authorization Enhancements**: Improved authorization handling
  - Enhanced `@Authorization` decorator with comprehensive options
  - Backward compatibility with existing authorization field configurations
  - Flexible authorization value resolution and processing
  - Integration with security provider system for unified authentication

### Developer Experience in 4.8.0

- **Enhanced Type Safety**: Improved type definitions and error corrections
  - Fixed `keyForamt` typo to `keyFormat` in `IQueryFieldOption` interface
  - Type-safe security provider interfaces and implementations
  - Better TypeScript inference for authorization configurations
  - Enhanced error test cases with `isDeduped` property for better debugging
- **Code Quality Improvements**: Enhanced codebase maintainability
  - Fixed spelling errors throughout the codebase (`excpetation` to `expectation`)
  - Simplified field option structure by removing nested option wrappers
  - Extracted `DedupeResult` interface for better type organization
  - Enhanced debug information for deduplication and security processes
- **Documentation Enhancements**: Comprehensive documentation improvements
  - Updated `cacheKeyExcludePath` references to `cacheKeyExcludePaths` for consistency
  - Fixed logo paths in VitePress configuration for better asset management
  - Enhanced validator registration comments for improved code clarity

### Infrastructure in 4.8.0

- **Testing Framework**: Comprehensive testing improvements
  - Complete test coverage for deduplication system with various scenarios
  - Integration tests for security provider system and authorization decorators
  - Enhanced error handling test cases with proper type definitions
  - Performance testing for request deduplication efficiency
- **Development Workflow**: Enhanced development processes
  - Git hooks initialization script (`init-hooks`) for automated development setup
  - Improved project documentation with detailed agent guidelines
  - Better organization of documentation assets and configuration files
- **Architecture Refinements**: Improved code organization and structure
  - Modular field option processor structure for better maintainability
  - Enhanced processor architecture with simplified field options
  - Cleaner deduplication logic with extracted interfaces and improved debugging
  - Streamlined cache key generation utilities with JSON handling improvements

### Documentation in 4.8.0

- **Request Deduplication Documentation**: Comprehensive deduplication guides
  - Korean documentation: `docs/ko/method/dedupe.md` with complete implementation guide
  - English documentation: `docs/method/dedupe.md` with examples and best practices
  - Cache key customization examples and exclude option configurations
  - Performance benefits and debugging techniques documentation
- **Security Documentation**: Added comprehensive security and authorization guides
  - Korean documentation: `docs/ko/method/authorization.md` with complete implementation guide
  - English documentation: `docs/method/authorization.md` with examples and best practices
  - Security provider implementation examples and configuration patterns
- **Visual Documentation**: Enhanced documentation with better visual elements
  - Mermaid sequence diagrams for deduplication workflow visualization
  - Improved logo and asset management across documentation platforms
  - Better structured examples with visual flow diagrams for complex scenarios

### Performance Improvements in 4.8.0

- **Network Optimization**: Significant improvements in network efficiency
  - Automatic duplicate request elimination reducing network traffic
  - Faster response times for deduplicated requests through shared responses
  - Reduced server load through intelligent request consolidation
- **Memory Management**: Enhanced memory usage optimization
  - Automatic cleanup of completed requests from deduplication cache
  - Efficient cache key generation with minimal memory footprint
  - Smart garbage collection for pending request management

## 4.7.0

### New Features in 4.7.0

- **Enhanced Validation System**: Major improvements to validation architecture and error handling
  - `BaseValidator` class: New validation framework with customizable validation logic and data transformation
  - New exception classes: `JinCreateError`, `JinRequestError`, and `JinValidationtError` for better error categorization
  - `@Validator` decorator: Declarative validation configuration for request methods
  - `runAndUnwrap` utility: Complete TypeScript migration with enhanced type safety and generic support
  - Integration with JinFrame validation pipeline for automatic response validation
- **Project Documentation**: Added comprehensive roadmap and planning documentation
  - Korean roadmap: `ROADMAP.ko.md` with detailed feature planning and future enhancements
  - English roadmap: `ROADMAP.md` with internationalized development plans

### Documentation Improvements in 4.7.0

- **Comprehensive Validation Documentation**: Added detailed validation guides and examples
  - Korean documentation: `docs/ko/method/validation.md` with BaseValidator class implementation guide
  - English documentation: `docs/method/validation.md` with complete translation and examples
  - Enhanced usage documentation with `pathPrefix` and `validator` options in method decorators
- **Enhanced Field Documentation**: Updated query parameter documentation
  - Added `keyFormat` option usage and examples in both Korean and English
  - Comprehensive array formatting examples with practical use cases
  - Updated all field documentation for consistency and clarity
- **Documentation Infrastructure**: Fixed TypeDoc and VitePress build processes
  - Updated build commands and configuration for better documentation generation
  - Enhanced documentation deployment workflow and CI/CD integration

### Developer Experience in 4.7.0

- **Enhanced Type Safety**: Complete type safety improvements across validation and utility systems
  - `runAndUnwrap` function with full TypeScript type inference and generic constraints
  - Automatic parameter and return value type inference for all function calls
  - Eliminated `any` types in favor of proper generic type constraints
  - Reduced runtime errors through comprehensive compile-time type checking
- **Better Error Handling**: Improved error handling and semantic naming conventions
  - `JinValidationtError`: Renamed `validation` property to `validated` for semantic clarity
  - Self-type pattern implementation for correct type inference in inherited classes
  - Enhanced error categorization with specific exception types for different failure scenarios

### Infrastructure in 4.7.0

- **Code Quality Improvements**: Enhanced codebase quality and maintainability
  - Complete TypeScript migration for utility functions with strict type checking
  - Strict adherence to `@typescript-eslint` rules for improved code quality
  - Eliminated unsafe type assertions and improved type inference throughout
- **Architecture Refinements**: Improved API design and separation of concerns
  - Resolved class naming conflicts between validation classes and decorators
  - Enhanced type inference for complex generic scenarios and inheritance patterns
  - Better separation of concerns between validation logic and request handling
- **Documentation Infrastructure**: Enhanced documentation build and deployment processes
  - Fixed VitePress configuration and TypeDoc integration
  - Improved documentation deployment workflow with better error handling
  - Enhanced multi-language documentation support and consistency

## 4.6.0

### Major Architecture Changes in 4.6.0

- **Monorepo Migration**: Complete migration to monorepo structure with three main packages
  - `@jin-frame/jin-frame`: Core HTTP client framework
  - `@jin-frame/generator-cli`: CLI tool for generating frame classes from OpenAPI specifications
  - `@jin-frame/generator-core`: Core generation functionality and utilities

### New Features in 4.6.0

- **Retry-After Header Support**: Implemented HTTP standard retry-after header handling
  - New `useRetryAfter` option in `IFrameRetry` interface
  - `getRetryAfter` utility function for parsing retry-after values
  - Enhanced retry logic to prioritize server-specified retry intervals
- **PathPrefix Support**: Added pathPrefix configuration for API endpoint management
  - Enhanced URL construction with host, pathPrefix, and path concatenation
  - Better support for API versioning and path organization
- **Code Generation Tools**: Comprehensive OpenAPI-to-TypeScript frame generation
  - Command-line interface for generating type-safe HTTP client classes
  - Support for OpenAPI v2 and v3 specifications
  - Automatic generation of decorators and type definitions

### Improvements in 4.6.0

- **Enhanced Documentation**: Comprehensive documentation improvements
  - Refined examples for decorators including Retry and Timeout
  - Updated getting started guides
  - Enhanced method usage documentation
  - Consistent brand imaging across all platforms
- **Dependency Management**: Streamlined dependency management across packages
  - Removed unused dependencies like `dayjs` and `@optique/*`
  - Updated core dependencies including axios, TypeScript, and ESLint
  - Consistent version management across monorepo packages

### Developer Experience in 4.6.0

- **CLI Tools**: New command-line tools for enhanced development workflow
  - `jin-frame-generator` CLI for automatic frame generation
  - Support for various OpenAPI input formats (JSON, YAML, URLs)
  - Customizable generation options and output configurations
- **Enhanced Type Safety**: Improved type definitions and validation
  - Better parameter validation and coercion
  - Enhanced OpenAPI schema validation
  - Improved error handling and debugging capabilities

### Infrastructure in 4.6.0

- **Monorepo Setup**: Complete restructuring for better maintainability
  - Workspaces configuration with pnpm
  - Individual package management and versioning
  - Optimized build and development workflows
- **Git Workflow Enhancements**: Improved development processes
  - Enhanced pre-commit hooks with package-specific filtering
  - Better CI/CD integration for monorepo structure
  - Streamlined release and deployment processes

## 4.5.0

### New Features in 4.5.0

- **Declarative Request Configuration**: Added new decorators for enhanced request configuration
  - `@Retry`: Declarative retry configuration for request methods
  - `@Timeout`: Declarative timeout configuration for request methods
- **Enhanced Hook Support**: Added comprehensive async preHook and postHook functionality
- **Error Handling Utilities**: Improved error handling with new utility functions

### Improvements in 4.5.0

- **Testing Infrastructure Overhaul**: Replaced nock with MSW (Mock Service Worker) for better HTTP request mocking
  - More realistic and maintainable test scenarios
  - Better integration with modern testing practices
  - Enhanced test coverage for async hooks
- **Documentation Enhancement**: Comprehensive documentation improvements
  - Updated installation instructions
  - Added Retry/Timeout configuration sections
  - Improved README with better examples and explanations
- **Brand Identity**: Added jin-frame brand images across documentation platforms

### Developer Experience in 4.5.0

- **Declarative Configuration**: Simplified retry and timeout configuration using decorators
- **Better Test Utilities**: More robust and realistic testing capabilities with MSW
- **Enhanced Documentation**: Clearer installation guides and configuration examples
- **Visual Identity**: Consistent brand imaging across all documentation platforms

### Infrastructure in 4.5.0

- **Option Merging Refactoring**: Improved option merging utilities for better configuration handling
- **Hook Processing**: Enhanced hook processing for both synchronous and asynchronous operations
- **Documentation Assets**: Proper asset management for documentation deployment

## 4.4.0

### New Features in 4.4.0

- **Query String Key Formatting**: Added new `keyFormat` option for enhanced query string key formatting
  - Support for array notation: `name[]=ironman&name[]=hulk`
  - Support for indexed notation: `name[0]=ironman&name[1]=hulk`
  - Flexible query string key formatting options

### Improvements in 4.4.0

- **Codecov Integration**: Upgraded Codecov action from v3 to v5 for better test coverage reporting
- **CI/CD Optimizations**: Enhanced continuous integration workflows
  - Coverage upload now runs only on Node.js v20
  - Documentation deployment triggered only on changes to `docs/**` and `assets/**`
  - Added dedicated test running stage in CI pipeline

### Infrastructure in 4.4.0

- **Branch Token Configuration**: Added branch token support for Codecov integration
- **Workflow Efficiency**: Improved CI workflow performance and resource usage
- **Development Process**: Enhanced development workflow with better TODO tracking and task management

## 4.3.0

### New Features in 4.3.0

- **Extended HTTP Method Decorators**: Added new HTTP method decorators for additional REST operations
  - `@Search`: For SEARCH HTTP method
  - `@Purge`: For PURGE HTTP method  
  - `@Link`: For LINK HTTP method
  - `@Unlink`: For UNLINK HTTP method

### Improvements in 4.3.0

- **Type System Refactoring**: Major reorganization of interface types with better categorization
  - Moved interfaces to `field/`, `options/` directories for better organization
  - Enhanced type safety across the framework
- **Documentation System Overhaul**: Complete restructuring of VitePress documentation
  - Comprehensive field documentation (body, header, param, query, objectbody, formatters)
  - Enhanced method documentation (authorization, form, inheritance, mocking, retry)
  - Improved Korean and English documentation coverage

### Infrastructure in 4.3.0

- **GitHub Actions Integration**: Added automated documentation deployment workflow
- **CI/CD Enhancements**: Improved documentation build and deployment processes
- **Workflow Optimization**: Fixed and enhanced documentation generation workflows

### Documentation in 4.3.0

- **Comprehensive Field Guides**: Detailed documentation for all field types and their usage
- **Method Usage Examples**: Extensive examples for authentication, forms, inheritance, and retry mechanisms
- **Bilingual Support**: Enhanced Korean and English documentation with consistent coverage
- **Interactive Examples**: Better structured examples and use cases

## 4.2.1

### Bug Fixes in 4.2.1

- **Metadata Merge Logic**: Fixed metadata merge logic to properly skip undefined values during inheritance processing
- **Option Merging**: Enhanced option merging functionality to handle undefined values correctly

### Documentation in 4.2.1

- **VitePress Enhancement**: Added comprehensive usage documentation for parameters, queries, and headers
- **Korean Documentation**: Extended Korean language documentation with new usage guides
- **Usage Examples**: Added detailed examples for parameter, query, and header usage patterns

### Improvements in 4.2.1

- **Inheritance Testing**: Added comprehensive test cases for class inheritance scenarios
- **Option Handling**: Improved option merging and frame configuration logic
- **Documentation Coverage**: Significantly expanded documentation coverage for common use cases

## 4.2.0

### New Features in 4.2.0

- **Authorization Option**: Added new authorization option for enhanced authentication support
- **URL Utilities**: Added new `getEndpoint` function for better URL handling and endpoint management

### Improvements in 4.2.0

- **Documentation Enhancement**: Improved README.md with better examples and explanations
- **Authentication Support**: Enhanced authentication handling with new authorization options
- **URL Management**: Better URL processing and endpoint generation capabilities
- **Test Coverage**: Added comprehensive test cases for new authentication and URL features

### Developer Experience in 4.2.0

- **Simplified Authentication**: Easier authentication setup with new authorization options
- **URL Handling**: More intuitive URL and endpoint management
- **Better Documentation**: Enhanced README with clearer examples and usage patterns
- **Improved Testing**: More robust test coverage for authentication and URL utilities

## 4.1.0

### New Features in 4.1.0

- **Builder Pattern Support**: Added static factory functions for builder pattern implementation
- **VitePress Documentation**: Introduced comprehensive VitePress-based documentation system
- **Enhanced Type Utilities**: Added new type utilities for better builder pattern support
  - `TBuilderFor`: Type utility for creating builder patterns
  - `TFieldsOf`: Type utility for extracting field types

### Improvements in 4.1.0

- **Documentation System**: Complete migration to VitePress for better documentation experience
- **Korean Documentation**: Added Korean language support for documentation
- **README Updates**: Enhanced README with better examples and usage patterns
- **Asset Updates**: Improved visual assets and diagrams

### Documentation in 4.1.0

- **Getting Started Guide**: Added comprehensive getting started documentation
- **API Examples**: Enhanced API usage examples and patterns
- **Multi-language Support**: Documentation now available in Korean and English
- **Interactive Examples**: Better examples with practical use cases

### Developer Experience in 4.1.0

- **Builder Pattern**: Simplified object creation with builder pattern support
- **Better Examples**: More practical and comprehensive code examples
- **Improved Assets**: Updated visual guides and documentation assets
- **TypeDoc Integration**: Enhanced API documentation generation

## 4.0.0

### Breaking Changes in 4.0.0

- **Request Field Decorators Migration**: Request field decorators have been migrated to pure functions for better type safety and performance
- **reflect-metadata Integration**: All decorators now use the reflect-metadata package for metadata management
- **Static Factory Functions**: Added static factory functions for improved type inference and developer experience
- **Constructor Interface Changes**: Updated constructor interfaces in AbstractJinFrame, JinEitherFrame, and JinFrame classes

### New Features in 4.0.0

- **Static Factory Functions**: Added helper factory functions for better type inference
- **Enhanced Class Decorators**: New class decorator system for configuration management
- **Improved Error Handling**: Enhanced status code and status text handling for axios errors
- **Better Type Utilities**: Added new type utilities like `InstanceFields` for improved type safety

### Improvements in 4.0.0

- **Test Coverage Enhancement**: Significantly improved test coverage across all modules
- **ESLint v9 Migration**: Upgraded to ESLint v9 with modern configuration
- **Documentation Updates**: Enhanced README.md and added VitePress documentation
- **Performance Optimizations**: Improved body field and object-body performance
- **Retry Mechanism**: Enhanced retry functionality with better error handling

### Dependencies in 4.0.0

- **my-easy-fp**: 0.21.0 → 0.22.0
- **path-to-regexp**: 6.2.1 → 8.2.0
- **reflect-metadata**: 0.1.13 → 0.2.2

### Developer Experience in 4.0.0

- **Better Type Inference**: Static factory functions provide improved type inference
- **Enhanced Error Messages**: More descriptive error handling and status reporting
- **Improved Documentation**: Added comprehensive examples and API documentation
- **Modern Tooling**: Updated build and development tools for better DX

## Compatibility and migration

Examples are labeled by version; do not mix historical generic arguments or method names with the 6.0 API.

### Release status and scope

- **6.0.0 repository target.** The runtime manifest declares 6.0.0, and generator manifests declare 1.0.0. Publication must be verified separately; these notes describe the current source API.
- Historical reference points are repository tags `v3.14.0`, `v4.0.0`, `v4.8.0`, and `v5.1.0`. Minor releases within a major can differ; use the tag matching your installed version when checking signatures.
- Generator CLI and core have independent `1.0.0` package versions. Their generated frames must target the matching jin-frame runtime API; a generator version alone does not establish runtime compatibility.
- Consumer-facing behavior is distinguished from build-tool changes. Removing `tsc-alias` from this repository does not require applications to remove their own alias tooling.

### Choose your migration path

| Installed API | Main work before adopting 6.0 |
| --- | --- |
| 3.x | Replace static field decorators and constructor-based endpoint setup; migrate Axios behavior, method names, authentication, and response types. |
| 4.x | Migrate Axios/Either usage, method and type names, URI templates, validators, authentication, and response generics. |
| 5.x | Replace `Pass, Fail` generics with status/data unions; move decorator status policies to call options; migrate response/error consumers and dedupe expectations. |
| An earlier 6.0 development snapshot | Remove generated `_defaultValidateStatus` fields and helper imports used only by those fields. Default 2xx inference is now shared by the base class. |

Work through the relevant sections in order. For a large application, first update its shared base frames and HTTP adapter, then regenerate endpoint frames, then update callers. Keep each runtime/generator pair pinned while migrating.

### 6.0 migration from 5.x

#### 1. Declare responses as a status/data union

**Breaking:** `JinFrame<Pass, Fail>` becomes `JinFrame<Response>`. The argument represents response envelopes, not a body DTO. `status` must be numeric and `data` must be present on every member, including responses with no body.

Before, in 5.x:

```typescript
class GetUserFrame extends JinFrame<User, NotFound> {}
```

After, in 6.0:

```typescript
import { Get, JinFrame } from 'jin-frame';

type User = { id: string; name: string };
type NotFound = { code: 'USER_NOT_FOUND'; message: string };
type UserResponse =
  | { status: 200; data: User }
  | { status: 404; data: NotFound };

@Get({ host: 'https://api.example.com', path: '/users/current' })
class GetUserFrame extends JinFrame<UserResponse> {}
```

For an empty response, write `{ status: 204; data: undefined }`. Preserve separate union members when different statuses have different bodies. Avoid `{ status: 200 | 404; data: User | NotFound }`: it loses the relationship between a code and its body.

`status: number` remains supported for broad/manual declarations, but cannot provide exact status narrowing. The default success filter preserves broad numeric declarations rather than assuming a specific documented success code. Prefer literal status codes whenever known. Type declarations do not validate server payloads; use validators when runtime body validation is required.

#### 2. Default calls infer successful responses

An omitted or undefined call-level `validateStatus` uses the native HTTP success policy (2xx). The return type contains only the declared successful variants.

```typescript
const response = await GetUserFrame.of({})._execute();
response.data.name; // User; a documented 404 is thrown instead of returned.
```

The same rule applies to the function returned by `_create()`. If the API documents different successful bodies, such as 200 and 202, the default return type remains their union; narrow by `status`. No successful response is arbitrarily selected as the primary response.

If a literal response union has no 2xx member, the inferred default result is `never`. Supply an explicit policy when intentionally returning a documented non-2xx response. An undocumented server response can still occur at runtime; the generated/static types are not a runtime schema check.

#### 3. Move status policies out of decorators

**Breaking:** `FrameOption.validateStatus` is removed. `@Get`, `@Post`, and other frame configuration decorators no longer accept it. A decorator cannot convey its predicate to the class's method return type, so allowing it to redefine acceptance would make default success inference unsound.

Before, in 5.x:

```typescript
@Get({
  host: 'https://api.example.com',
  path: '/users/current',
  validateStatus: (_ok, status) => status === 200 || status === 404,
})
class GetUserFrame extends JinFrame<User, NotFound> {}
```

After, keep endpoint configuration in the decorator and put acceptance at the call site:

```typescript
import { validateStatus } from 'jin-frame';

const response = await GetUserFrame.of({})._execute({
  validateStatus: validateStatus(200, 404),
});

if (response.status === 404) {
  response.data.code; // NotFound
} else {
  response.data.name; // User
}
```

For repeated calls, reuse an options object or create a requester with `_create({ validateStatus: validateStatus(200, 404) })`. A wrapper can centralize application policy while preserving inferred return types.

| Call policy | Runtime acceptance | Inferred return type |
| --- | --- | --- |
| Omitted / `undefined` | Native 2xx success | Declared successful variants |
| `validateStatus(200)` | Exactly 200 | Declared 200 variant |
| `validateStatus(200, 404)` | Exactly 200 or 404 | Declared 200/404 variants |
| A correctly declared status type guard | Predicate result | Variants selected by the predicate |
| An ordinary boolean callback | Callback result | Full declared response union |
| `() => true` | Every received HTTP status | Full declared response union |

A boolean callback such as `(ok) => ok` is conservative at the type level: it does not carry a status predicate. Omit it to get default success inference. TypeScript trusts manually written type guards; prefer the helper to keep the accepted list and the predicate aligned.

The helper does not introduce undocumented body types. Selecting an undocumented code does not create a new response variant.

#### 4. Narrow by `status`, not `ok`

**Breaking:** the response is no longer `JinPassResp<Pass> | JinFailResp<Fail>`. `JinPassResp` and `JinFailResp` are removed; use `JinResp<ResponseUnion>`. `ok` is a boolean describing whether the configured policy accepted the response, not a type discriminator or an unconditional synonym for HTTP 2xx.

```typescript
const response = await GetUserFrame.of({})._execute({
  validateStatus: () => true,
});

if (response.status === 200) {
  response.data.name;
} else if (response.status === 404) {
  response.data.code;
}
```

An accepted 404 has `ok: true`. Checking `response.ok` does not narrow its body. Update hooks, validators, and utilities that previously depended on `ok: true | false` discrimination.

| Previous declaration | 6.0 replacement |
| --- | --- |
| `JinFrame<Pass, Fail>` | `JinFrame<ResponseUnion>` |
| `JinResp<Pass, Fail>` | `JinResp<ResponseUnion>` |
| `JinPassResp<Pass>` / `JinFailResp<Fail>` | `JinResp<ResponseUnion>` or a status-selected subset |
| `JinRespError<Pass, Fail>` | `JinRespError<ResponseUnion>` |
| Hook accepting separate pass/fail types | Hook accepting `JinResp<ResponseUnion>` |

The former combined `Hooks` declaration is also replaced by individual hook types (`PreHook`, `PostHook`, and `RetryFailHook`); update direct imports of the removed type.

Review explicit `GetError`, `JinFrameFunction`, `PostHook`, `JinValidationError`, and custom validator type annotations too. Follow their current exported declarations rather than mechanically removing a generic argument: some parameters represent validation errors or frame types, not response bodies.

#### 5. Handle errors without inventing an HTTP response

`JinRespError.resp` can be undefined. Network failures, cancellation, and errors before a usable HTTP response exists cannot supply a real response body. Inspect `cause` and the presence of `resp` separately.

```typescript
import { JinRespError } from 'jin-frame';

try {
  await GetUserFrame.of({})._execute();
} catch (error) {
  if (error instanceof JinRespError) {
    if (error.resp == null) {
      console.error(error.cause);
    } else {
      console.error(error.resp.status, error.resp.data);
    }
  } else {
    throw error;
  }
}
```

The error's numeric `status` may be a fallback value when no response exists. Do not infer that a server returned HTTP 500 from that field alone. `validateStatus: () => true` accepts HTTP responses; it does not turn network errors, hook failures, or cancellation into successful results. Custom `getError` handlers can return other error classes, so retain application-specific handling.

#### 6. Review dedupe exclusions and cancellation

Execution dedupe keys now include the actual URL, method, normalized headers, string body, and timeout, alongside the field-based key. Different runtime hosts, paths, authentication values, or bodies must not share a response.

**Behavior change:** `cacheKeyExclude` and `cacheKeyExcludePaths` still affect `_getCacheKey()`, but do not override execution safeguards. Two requests whose actual URLs or bodies differ may now produce separate network calls even if the differing field was excluded. Review applications relying on excluded timestamps, request IDs, query parameters, or body properties to coalesce requests.

Requests with a caller-provided `AbortSignal` bypass dedupe, including callers sharing the same signal. Non-string bodies also bypass dedupe. This favors cancellation isolation and safe body handling over coalescing. Identical eligible requests still share one pending request, and bodyless 204/205/304 responses are reconstructed consistently for original and joining callers.

#### 7. Retry and timing behavior

- `retry.max` is the maximum number of attempts, not additional retries. With `max: 3`, there are at most three attempts and two intervening waits.
- There is no wait after the final failed HTTP response or exception.
- Caller cancellation stops retrying and interrupts an active retry wait. Per-attempt timeout handling remains distinct from explicit caller cancellation.
- Retry counters reset for each execution. Custom retry interval callbacks receive elapsed times based on the current execution and attempt, not instance construction.
- Response debug duration is measured per execution, including its hooks and retry work up to the point where debug information is constructed; it no longer includes time spent holding an unused instance.
- Public `_startAt`, `_eachStartAt`, and `_endAt` getters expose Date copies for the most recently started execution. Before execution, start values reflect construction time and `_endAt` is undefined. `_endAt` is cleared on start and recorded in the execution's finalization on success, failure, or cancellation. `_create()` records execution when its requester is invoked, not when it is prepared.
- Older overlapping executions cannot overwrite the latest execution's timestamp snapshot. Use each call's debug information for its individual duration. The frame snapshot is not a history of all calls.

Update fake-timer tests and latency expectations that counted a terminal retry delay. Do not add that delay back to preserve an obsolete expectation.

#### 8. Runtime, packaging, and generators

The workspace currently declares Node.js `>=22.23.4` and uses TypeScript `6.0.3`. CI exercises Node 22, 24, and 26. TypeScript 7 preparation is not a claim that the current compiler has been replaced by TypeScript 7.

`jin-frame` retains ESM and CommonJS runtime entry points. Generator core is ESM-only; the CLI is an executable-only ESM package and does not expose an importable library API. Use generator core for programmatic integration.

The declaration build removes `tsc-alias`, uses package subpath imports instead of remaining source `paths` aliases, and bundles declarations with Rollup. Consumers should import public package exports instead of repository source paths or private `#...` imports. This change does not mean `tsc` itself bundles declarations.

Regenerate endpoint frames and their `paths.d.ts` together into a clean temporary output directory before replacing committed generated files. Review generated response aliases and custom base frames/templates. The earlier development `_defaultValidateStatus` field is no longer generated or required. If a custom template still emits it, update the template.

The current generator models explicit numeric response codes; `2XX` and `default` response entries are not generated. Do not treat the generated union as exhaustive for specs relying on those entries. Core/CLI also add configurable hosts, endpoint overrides, security generation, progress reporting, and Eta templates; see their [core](./packages/generator-core/README.md) and [CLI](./packages/generator-cli/README.md) documentation for exact APIs.

#### 9. Migrate validation to the whole-response model

Register `validator: new ApiValidator()` or `@Validator<Replies>(new ApiValidator())` instead of `validators: { pass, fail }`. `BaseValidator<Replies, TError>` takes the response union, not a body DTO or a JinResp wrapper. Its default getData() returns the entire response. validator(response) chooses a schema using response.status and validates response.data. There is no separate extraction type argument or library-level status-keyed validator map.

Without a validator, valid is true; otherwise skipped statuses are a policy of your validator. validateStatus controls HTTP acceptance, independently of schema selection. Accepted invalid responses throw JinValidationError in exception mode or return their result in value mode. Rejected HTTP responses remain JinRespError with validation results. Extraction/validation exceptions retain the real HTTP response and original cause. See the [validation guide](./packages/docs/src/method/validation.md).

### 5.x migration from 4.x

These changes precede the 6.0 response-union migration. Skip this section only if your application already uses the 5.x API.

#### Transport and endpoint declarations

- Axios is replaced by native fetch. `JinRequestConfig` is no longer `AxiosRequestConfig`; remove Axios-only options, interceptors, response assumptions, and transport mocks from the jin-frame integration. Adapt them explicitly to hooks, request options, or application code.
- URI templates use `{id}` rather than `:id`. Update decorator paths, runtime URL templates, generated fixtures, and tests together.
- Native `Response` metadata is available through `raw`. The body may already be consumed. Use call-level `cloneRaw: true` if you need to read it again; cloning has a memory cost.
- `deserialize(text)` handles custom parsing. Invalid JSON falls back to its original text in 5.0.2 and later; do not assume every `data` value is an object.

#### Names and construction

| 4.x usage | 5.x usage, retained in 6.0 unless noted above |
| --- | --- |
| `execute()` / `create()` / `requestWrap()` | `_execute()` / `_create()` / `_requestWrap()` |
| `getData()` / `getCacheKey()` / `setFields()` | `_getData()` / `_getCacheKey()` / `_setFields()` |
| `IJinFrameRequestConfig` | `JinFrameRequestConfig` |
| `IDebugInfo` | `DebugInfo` |
| `IFrameOption` | `FrameOption` |
| `TMethod` | `Method` |

I/T prefixes were removed broadly. Consult the actual export when migrating each name; not every historical helper has a one-to-one replacement. Review custom subclasses and overrides in addition to direct calls.

`of()` accepts a field object or builder callback. Builders track required public fields and finish with `.build()`. Constructor arguments can be forwarded by `of()` and `builder()`. Fields excluded from the builder include methods and underscore-prefixed members; execution timestamp getters do not become request fields.

#### Authentication and validation

- `@Authorization` is removed. Supply the key through `@Security(provider, key)` or supported method options.
- `OAuth2Provider` is removed. Use `BearerTokenProvider` for sending OAuth2 Bearer access tokens; this does not implement the OAuth token acquisition/refresh flow for you.
- `SecurityKey` can be lazy or asynchronous. `_execute()` resolves function-based keys before request creation; a requester prepared with `_create()` does not independently provide the same key-resolution step on each invocation. Prefer `_execute()` when the configured key must be resolved per call.
- `validator` becomes `validators: { pass, fail }`. `valid` and `$validated` are always populated. Fail validators annotate the failure response and do not throw `JinValidationError`; pass validators can throw when configured with `type: 'exception'`.
- `validateStatus(status)` becomes `validateStatus(ok, status)`. A previously single-argument status callback would receive a boolean if copied unchanged. In 6.0, this callback is supported in call options only.

#### Either and response handling

`JinEitherFrame` and `my-only-either` integration are removed in 5.0. Use `JinFrame`. The **5.x** replacement has body generics `JinFrame<Pass, Fail>` and `JinResp<Pass, Fail>` with `ok` discrimination. The **6.0** replacement instead uses the status/data union described above. Do not stop at a 5.x Either migration example when targeting 6.0.

Keep rejected HTTP responses and successful responses distinct from transport errors. Test authentication failures and cancellation with native fetch/MSW rather than Axios error mocks.

#### 5.x minor releases worth checking

| Version | Consumer impact |
| --- | --- |
| 5.0.2 | Non-JSON response parsing retains the raw string. |
| 5.0.3 | Added decorator-level status policies; these must move to call options in 6.0. |
| 5.0.4 | Inherited decorated fields are discovered through the prototype chain. Check subclasses with shadowed fields. |
| 5.1.0 | Added runtime `host`, `pathPrefix`, and `path` overrides. Review tenant/auth isolation when using dedupe. |

Historical runtime support statements in the release history above apply to their release context, not automatically to the current development branch.

### 4.x migration from 3.x

At the `v3.14.0` reference point, field decorators were static members such as `JinFrame.query()` / `JinFrame.Q()` and endpoint configuration could be passed through constructor arguments such as `$$host`, `$$path`, and `$$method`.

In 4.0, use exported field decorator functions (`Query`, `Param`, `Body`, `ObjectBody`, `Header`) and method/class metadata for endpoint configuration. Review subclass constructors and `super(...)` calls; do not carry obsolete constructor configuration into a no-argument frame factory. Static factories such as `of()` were introduced for typed construction.

For example, the field declaration changes from a static decorator to an exported function:

```typescript
// 3.x field declaration
@JinFrame.query()
public readonly search?: string;
```

```typescript
// Current field declaration
@Query()
declare public readonly search?: string;
```

The `declare` form is appropriate for metadata-decorated fields populated through the frame factory; also check your project's class-field emit settings. Preserve legacy decorator compiler options and `reflect-metadata` integration rather than switching to standard decorators as part of this migration.

Both the 3.x and 4.x reference implementations still used Axios and offered `JinEitherFrame`. Those concerns are separate from the field-decorator migration and are removed later in 5.x. Hook spellings also changed between major APIs (the 4.0/4.8 reference implementations used `$_preHook`, while the current API uses `_preHook`); inspect overridden hook names in the source for your installed tag rather than assuming all 4.x examples are identical.

For historical details beyond these verified reference points, use [the existing 4.x release notes](./CHANGED.md#400) and the matching repository tag. This document does not invent unverified minor-release migration guarantees for 3.x.

### Application migration checklist

1. Record the exact installed runtime and generator versions. Pin them and save representative generated output before upgrading.
2. Search application code and custom templates for `JinEitherFrame`, Axios options/types, `:param` paths, old method names, I/T-prefixed imports, and overridden hooks.
3. Convert shared frame and response types. Give each documented status its own envelope; include `data: undefined` for bodyless statuses.
4. Move every decorator `validateStatus` to a call or reusable requester. Prefer the typed helper when selecting known statuses; use a boolean callback deliberately when returning the full union.
5. Replace `ok`-based body narrowing with `status` checks. Audit hooks, validators, and custom error handlers, not just endpoint callers.
6. Guard optional `error.resp` and inspect `cause`. Do not reinterpret cancellation as an HTTP server response.
7. Regenerate into a separate directory, review diffs, then replace generated files. Update custom base classes and Eta templates before regenerating application output.
8. Run the application's actual type check. Verify one 200-only endpoint needs no narrowing and one 200/404 policy narrows to the correct bodies.
9. Test different users/hosts concurrently with dedupe enabled, excluded request fields, already-aborted signals, cancellation during retry waits, and bodyless responses.
10. Verify retry attempt counts, removal of the terminal delay, and execution timestamps when a frame is reused or requests overlap.
11. Deploy through the application's normal staged rollout. Retain the previous pinned dependency set and generated artifacts for rollback; restoring only the runtime can leave incompatible generated types behind.

AI-assisted edits can reduce repetitive work, but casts such as `as any`, non-null assertions on `error.resp`, or broad `status: number` declarations can hide a migration defect. Review behavior changes and keep the regression checks above even when compilation succeeds.
