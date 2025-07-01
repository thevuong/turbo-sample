# SOLID Principles Reorganization Plan for CLI Package

## Current Structure Analysis

### Current Organization

```
packages/cli/src/
├── bin/cli.ts                    # CLI entry point
├── commands/generate-exports.ts  # Command implementations
├── schemas/validation.ts         # All validation schemas (ISSUE)
├── services/                     # Business logic services
│   ├── ast/                      # AST-related services
│   │   ├── analyzer.ts
│   │   └── enhanced-file-scanner.ts
│   ├── config-loader.ts
│   ├── export-generator.ts
│   ├── logger.ts
│   └── package-manager.ts
└── types/                        # Type definitions (well organized)
    ├── core/
    ├── enums/
    ├── models/
    ├── results/
    └── services/
```

## SOLID Principles Violations Identified

### 1. Single Responsibility Principle (SRP) Violations

- **schemas/validation.ts**: Contains all validation schemas in one file
  - Package validation schemas
  - Export configuration schemas
  - CLI options schemas
  - Generator options schemas

### 2. Potential Improvements for Better Organization

#### Services Directory

Current services are mixed by technical concerns rather than business domains:

- File system operations (package-manager.ts)
- Configuration loading (config-loader.ts)
- Export generation (export-generator.ts)
- Logging (logger.ts)
- AST analysis (ast/ subdirectory)

## Proposed Reorganization

### 1. Split Validation Schemas by Domain (SRP)

```
schemas/
├── package/                      # Package-related schemas
│   ├── package-json.ts          # Package.json validation
│   └── package-export.ts        # Package export schemas
├── configuration/               # Configuration schemas
│   ├── export-config.ts         # Export configuration
│   └── cli-options.ts           # CLI options validation
└── index.ts                     # Re-export all schemas
```

### 2. Reorganize Services by Domain (SRP + ISP)

```
services/
├── infrastructure/              # Infrastructure concerns
│   ├── logger.ts               # Logging service
│   └── file-system.ts          # File system operations
├── configuration/              # Configuration management
│   └── config-loader.ts        # Configuration loading
├── package-management/         # Package-related operations
│   └── package-manager.ts      # Package.json operations
├── export-generation/          # Export generation domain
│   └── export-generator.ts     # Export generation logic
├── analysis/                   # Code analysis domain
│   ├── ast-analyzer.ts         # AST analysis
│   └── file-scanner.ts         # File scanning
└── index.ts                    # Re-export all services
```

### 3. Enhanced Commands Structure

```
commands/
├── generate-exports/           # Generate exports command domain
│   ├── command.ts             # Main command implementation
│   ├── options.ts             # Command options handling
│   └── validator.ts           # Command validation logic
└── index.ts                   # Re-export all commands
```

### 4. Improved Bin Structure

```
bin/
├── cli.ts                     # Main CLI application
├── command-registry.ts        # Command registration (OCP)
└── dependency-container.ts    # DI container (DIP)
```

## Benefits of This Reorganization

### 1. Single Responsibility Principle (SRP)

- Each schema file handles validation for one specific domain
- Services are organized by business domain rather than technical implementation
- Commands are split into focused responsibilities

### 2. Open/Closed Principle (OCP)

- Command registry allows adding new commands without modifying existing code
- Service organization makes it easier to extend functionality

### 3. Interface Segregation Principle (ISP)

- Domain-specific services have focused interfaces
- Clients depend only on interfaces they actually use

### 4. Dependency Inversion Principle (DIP)

- Dependency container centralizes dependency management
- High-level modules don't depend on low-level implementation details

### 5. Liskov Substitution Principle (LSP)

- Current implementation already follows this well with proper interfaces

## Implementation Steps

1. **Phase 1: Split Validation Schemas**
   - Create domain-specific schema files
   - Update imports across the codebase
   - Maintain backward compatibility through index.ts

2. **Phase 2: Reorganize Services by Domain**
   - Move services to domain-specific directories
   - Update imports and exports
   - Ensure all factory functions are properly exported

3. **Phase 3: Enhance Commands Structure**
   - Split large command files into focused modules
   - Implement command registry pattern

4. **Phase 4: Improve Dependency Management**
   - Create dependency container
   - Centralize service instantiation

## Backward Compatibility

All changes will maintain backward compatibility through:

- Proper re-exports in index.ts files
- Maintaining existing public APIs
- Gradual migration approach

## Expected Outcomes

1. **Better Maintainability**: Each file has a single, clear responsibility
2. **Improved Testability**: Smaller, focused modules are easier to test
3. **Enhanced Extensibility**: Domain organization makes it easier to add features
4. **Clearer Architecture**: Business domains are clearly separated
5. **Better Developer Experience**: Easier to find and modify specific functionality
