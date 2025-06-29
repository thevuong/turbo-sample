# ESLint Sample Monorepo - Development Guidelines

## Project Structure

This is a **Turborepo monorepo** containing an ESLint configuration package and sample applications:

```
├── apps/
│   └── sample-app/           # Sample application demonstrating ESLint config usage
├── packages/
│   └── eslint-config/        # Main ESLint configuration package (@eslint-sample/eslint-config)
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json             # Root package.json with workspace scripts
```

### Key Technologies

- **Package Manager**: pnpm@9.12.0 (specified in package.json)
- **Build Orchestration**: Turborepo v2.5.4
- **Module System**: ES modules (`"type": "module"`)
- **TypeScript**: v5.8.3 with strict configuration

## Build/Configuration Instructions

### Prerequisites

- Node.js (compatible with ES2022 target)
- pnpm 9.12.0 or compatible

### Initial Setup

```bash
# Install dependencies for all workspaces
pnpm install

# Build all packages
pnpm build
```

### Development Workflow

```bash
# Start development mode (watch mode for all packages)
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Run tests across all packages
pnpm test

# Clean build artifacts
pnpm clean
```

### ESLint Config Package Build Process

The `@eslint-sample/eslint-config` package uses **rslib** for building:

- **Build Tool**: rslib (@rslib/core v0.10.4)
- **Output Formats**: Both ESM and CJS for maximum compatibility
- **TypeScript**: Generates declaration files (.d.ts)
- **Target**: Node.js environment with ES2021 syntax
- **Configuration**: `packages/eslint-config/rslib.config.ts`

Build outputs:

- `dist/esm/` - ES modules with .js and .d.ts files
- `dist/cjs/` - CommonJS modules with .cjs and .d.ts files

## Testing Information

### Testing Framework

Uses **Node.js built-in test runner** with **tsx** for TypeScript support:

```bash
# Run tests in a specific package
cd packages/eslint-config
pnpm test

# Run tests from root (all packages)
pnpm test
```

### Adding New Tests

1. Create test files with `.test.ts` extension in the `src/` directory
2. Use Node.js built-in test functions:

   ```typescript
   import { strict as assert } from "node:assert";
   import { test, describe } from "node:test";

   describe("Your Feature", () => {
     test("should do something", () => {
       assert.equal(actual, expected);
     });
   });
   ```

3. Import from TypeScript source files using `.ts` extension:
   ```typescript
   import { yourFunction } from "./your-module.ts";
   ```

### Test Configuration

- **Test Runner**: `tsx --test src/**/*.test.ts`
- **Dependencies**: tsx is required as devDependency for TypeScript support
- **Test Files**: Excluded from build output (configured in rslib.config.ts and tsconfig.build.json)

### Example Test Execution

```bash
cd packages/eslint-config
pnpm test
# Output: ✔ All tests pass with detailed results
```

## Code Style and Development Practices

### TypeScript Configuration

- **Target**: ES2022 with ESNext modules
- **Module Resolution**: bundler
- **Strict Mode**: Enabled with all strict checks
- **Path Aliases**: Uses `@/` for `src/` directory

### ESLint Package Structure

The ESLint configuration follows a modular, atomic design:

```
src/
├── core/           # Base JavaScript and TypeScript rules
├── environments/   # Node.js and browser-specific configurations
├── languages/      # JSON, Markdown, CSS language support
├── frameworks/     # React and Next.js specific rules
├── presets/        # Pre-configured combinations (base, library, react-app, next-app)
└── utils/          # Utilities (composer, prettier integration, etc.)
```

### Code Patterns

1. **Exports**: Use both named and default exports for flexibility
2. **Type Safety**: All configurations use proper TypeScript types (`Linter.Config[]`)
3. **Comments**: Include explanatory comments for rule overrides
4. **Modularity**: Each file exports atomic configurations that can be composed

### ESLint Configuration Patterns

```typescript
// Example configuration structure
export const configName: Linter.Config[] = [
  {
    ignores: ["**/dist/**", "**/build/**"],
  },
  {
    files: ["**/*.{js,ts}"],
    rules: {
      "rule-name": "error", // Comment explaining why
    },
  },
];
```

### Package.json Scripts Standards

Each package should include:

- `build`: Build the package
- `dev`: Development/watch mode
- `lint`: ESLint validation
- `test`: Run tests
- `prepublishOnly`: Ensure build before publishing

## Important Notes for Development

1. **Build Before Testing**: The ESLint config package must be built before running tests that import from it
2. **Workspace Dependencies**: Use `workspace:*` for internal package dependencies
3. **Dual Module Support**: The ESLint config supports both ESM and CJS consumers
4. **Path Aliases**: TypeScript path aliases (`@/`) are configured for cleaner imports
5. **Turbo Caching**: Turbo caches build outputs; use `pnpm clean` if you encounter cache issues

## Debugging Tips

1. **Build Issues**: Check rslib.config.ts and ensure TypeScript configuration is correct
2. **Import Errors**: Verify path aliases and module resolution settings
3. **Test Failures**: Ensure packages are built before running tests
4. **Linting Issues**: The project uses its own ESLint configuration; check eslint.config.js files
