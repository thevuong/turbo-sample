# @eslint-sample/cli

A powerful CLI tool for automatically generating and managing `package.json` exports in monorepo packages. Built with TypeScript, following SOLID principles, and designed for modern JavaScript/TypeScript monorepos.

## Features

- 🔍 **Automatic File Discovery**: Scans package directories to detect exportable files
- 📦 **Dual Format Support**: Generates both ESM and CJS exports with TypeScript definitions
- 🎯 **Smart Export Generation**: Creates optimized export configurations based on file structure
- 🔧 **Customizable Mappings**: Support for custom export key mappings
- 🛡️ **Safe Operations**: Backup and dry-run modes for safe package.json updates
- 🏗️ **Monorepo Aware**: Automatically discovers packages in monorepo structure
- ✅ **Validation**: Built-in validation for generated export configurations
- 🎨 **Beautiful Output**: Colored console output with progress indicators

## Installation

```bash
# Install in your monorepo
pnpm add -D @eslint-sample/cli

# Or install globally
npm install -g @eslint-sample/cli
```

## Quick Start

```bash
# Generate exports for all packages in your monorepo
npx eslint-sample-cli generate

# Generate exports for a specific package
npx eslint-sample-cli generate --package eslint-config

# Preview what would be generated (dry run)
npx eslint-sample-cli generate --dry-run

# Create backup before updating
npx eslint-sample-cli generate --backup
```

## Commands

### `generate` (alias: `gen`)

Generate package.json exports for packages based on source files.

```bash
eslint-sample-cli generate [options]
```

#### Options

- `-p, --package <name>` - Target specific package (name or path)
- `--no-dual-format` - Generate single format exports only
- `-d, --dry-run` - Show what would be generated without writing files
- `-b, --backup` - Create backup before updating package.json
- `-i, --include <patterns...>` - Include patterns for files
- `-e, --exclude <patterns...>` - Exclude patterns for files
- `-m, --mappings <json>` - Custom export mappings as JSON string

#### Examples

```bash
# Generate exports for all packages
eslint-sample-cli generate

# Generate for specific package
eslint-sample-cli gen -p eslint-config

# Preview without writing
eslint-sample-cli gen --dry-run

# Create backup before updating
eslint-sample-cli gen --backup

# Include only preset files
eslint-sample-cli gen -i "presets/*"

# Exclude test files
eslint-sample-cli gen -e "test/*" "**/*.test.*"

# Custom export mappings
eslint-sample-cli gen -m '{"./custom":"./src/custom", "./alias":"./src/main"}'

# Single format exports only
eslint-sample-cli gen --no-dual-format
```

### `list` (alias: `ls`)

List packages and their current exports (coming soon).

### `validate`

Validate package.json exports configuration (coming soon).

## How It Works

The CLI follows a modular architecture with clear separation of concerns:

### 1. File Discovery

The CLI scans package directories for exportable files using configurable patterns:

- TypeScript/JavaScript files in `src/` and `lib/` directories
- JSON configuration files
- Excludes test files, build outputs, and node_modules

### 2. Export Generation

Based on detected files, the CLI generates appropriate export configurations:

**Dual Format (ESM + CJS):**

```json
{
  ".": {
    "import": {
      "default": "./dist/esm/index.js",
      "types": "./dist/esm/index.d.ts"
    },
    "require": {
      "default": "./dist/cjs/index.cjs",
      "types": "./dist/cjs/index.d.ts"
    }
  }
}
```

**Simple Format (JSON files):**

```json
{
  "./base": "./base.json",
  "./react": "./react.json"
}
```

### 3. Smart Sorting

Exports are automatically sorted with logical priority:

1. Main export (`.`) comes first
2. Common presets (`./base`, `./react`, `./next`)
3. Categorized exports (`./presets/`, `./core/`, `./utils/`)
4. Alphabetical within categories

## Configuration

### File Patterns

The CLI uses these default patterns to discover exportable files:

**Included:**

- `src/**/*.ts`
- `src/**/*.js`
- `lib/**/*.ts`
- `lib/**/*.js`
- `*.json` (configuration files)

**Excluded:**

- `**/*.test.ts`
- `**/*.test.js`
- `**/*.spec.ts`
- `**/*.spec.js`
- `**/*.d.ts`
- `**/tests/**`
- `**/node_modules/**`
- `**/dist/**`

### Export Key Generation

Export keys are generated based on file paths:

- `src/index.ts` → `.`
- `src/presets/base.ts` → `./presets/base`
- `src/core/javascript.ts` → `./core/javascript`
- `base.json` → `./base`

### Build Tool Detection

The CLI automatically detects dual format support by checking for:

- `rslib.config.ts/js`
- `rollup.config.ts/js`
- `webpack.config.ts/js`

## Integration

### Package Scripts

Add to your root `package.json`:

```json
{
  "scripts": {
    "exports:generate": "eslint-sample-cli generate",
    "exports:check": "eslint-sample-cli generate --dry-run",
    "exports:update": "eslint-sample-cli generate --backup"
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/ci.yml
- name: Validate exports
  run: |
    pnpm exports:check
    # Fail if exports are out of sync
    git diff --exit-code packages/*/package.json
```

### Pre-commit Hook

```json
{
  "lint-staged": {
    "packages/*/src/**/*.{ts,js}": ["eslint-sample-cli generate --package $(dirname $(dirname $0))"]
  }
}
```

## API Usage

You can also use the CLI programmatically:

```typescript
import { createCLI, createLogger, createExportGenerator } from "@eslint-sample/cli";

// Create CLI instance
const cli = createCLI();

// Or use individual services
const logger = createLogger();
const generator = createExportGenerator(logger);

// Generate exports programmatically
const exports = await generator.generateExports(detectedFiles, options);
```

## Architecture

The CLI follows SOLID principles with a modular architecture:

- **Logger**: Handles console output with colors and spinners
- **FileScanner**: Discovers exportable files using glob patterns
- **ExportGenerator**: Creates export configurations from detected files
- **PackageManager**: Reads and updates package.json files
- **Commands**: Implement specific CLI operations

Each service is dependency-injected and follows single responsibility principle.

## Examples

### Monorepo Structure

```text
my-monorepo/
├── packages/
│   ├── eslint-config/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── presets/
│   │   │   └── core/
│   │   └── package.json
│   └── typescript-config/
│       ├── base.json
│       ├── react.json
│       └── package.json
└── package.json
```

### Generated Exports

**For `eslint-config` (TypeScript package):**

```json
{
  "exports": {
    ".": {
      "import": {
        "default": "./dist/esm/index.js",
        "types": "./dist/esm/index.d.ts"
      },
      "require": {
        "default": "./dist/cjs/index.cjs",
        "types": "./dist/cjs/index.d.ts"
      }
    },
    "./presets/base": {
      "import": {
        "default": "./dist/esm/presets/base.js",
        "types": "./dist/esm/presets/base.d.ts"
      },
      "require": {
        "default": "./dist/cjs/presets/base.cjs",
        "types": "./dist/cjs/presets/base.d.ts"
      }
    }
  }
}
```

**For `typescript-config` (JSON package):**

```json
{
  "exports": {
    "./base": "./base.json",
    "./react": "./react.json"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Submit a pull request

## License

MIT © ESLint Sample Team
