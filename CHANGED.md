# Changed

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
