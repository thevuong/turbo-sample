# @eslint-sample/typescript-config

Shared TypeScript configurations for different use cases in the monorepo.

## Installation

```bash
pnpm add -D @eslint-sample/typescript-config
```

## Usage

This package provides TypeScript configurations for different project types:

### Base Configuration

The base configuration provides common TypeScript settings that other configurations extend from.

```json
{
  "extends": "@eslint-sample/typescript-config/base"
}
```

### Next.js Applications

For Next.js applications with React and server-side rendering support:

```json
{
  "extends": "@eslint-sample/typescript-config/next"
}
```

Features:

- Next.js plugin integration
- JSX support with `preserve` mode
- DOM and ES6 libraries
- Path aliases (`@/*` and `~/*`)
- Incremental compilation
- Includes `.next/types/**/*.ts` for Next.js generated types

### React Applications

For client-side React applications:

```json
{
  "extends": "@eslint-sample/typescript-config/react"
}
```

Features:

- React JSX support with `react-jsx` transform
- DOM and ES6 libraries
- Path aliases (`@/*` and `~/*`)
- Bundler module resolution (consistent with base config)
- Optimized for client-side applications

### Library Packages

For building reusable library packages:

```json
{
  "extends": "@eslint-sample/typescript-config/library"
}
```

Features:

- Declaration file generation (`.d.ts`)
- Source maps and declaration maps
- Composite project support for project references
- Incremental compilation
- Optimized build output structure
- Excludes test files and stories from build

## Configuration Details

### Common Features (Base)

All configurations include:

- **Strict Mode**: Full TypeScript strict checking enabled
- **Modern Target**: ES2022 target with ESNext modules
- **Enhanced Checks**:
  - `exactOptionalPropertyTypes`
  - `noFallthroughCasesInSwitch`
  - `noImplicitOverride`
  - `noImplicitReturns`
  - `noPropertyAccessFromIndexSignature`
  - `noUncheckedIndexedAccess`
  - `noUnusedLocals`
  - `noUnusedParameters`
- **Module Resolution**: Bundler-style resolution
- **JSON Support**: `resolveJsonModule` enabled
- **Isolated Modules**: Required for modern build tools

### Target Versions & Design Decisions

Each configuration uses a specific ES target optimized for its use case:

- **Base Configuration**: `ES2022` - Modern baseline with latest features
- **Library Configuration**: `ES2020` - Broader compatibility for published packages
- **React Configuration**: `ES2020` - Balance between modern features and browser support
- **Next.js Configuration**: `ES2017` - Optimized for Next.js runtime and SSR compatibility

### Optimization Features

This package has been optimized to eliminate redundancy:

- **Inheritance-based**: Extended configurations only override necessary options
- **No Duplication**: Common settings are inherited from base configuration
- **Consistent Module Resolution**: All configurations use bundler-style resolution
- **Minimal Footprint**: Each configuration file contains only unique settings

### Path Aliases

Most configurations support path aliases:

- `@/*` → `./src/*` (source directory)
- `~/*` → `./` (project root)

### Exclusions

All configurations exclude common build and test directories:

- `node_modules`
- `dist`, `build`, `coverage`
- Test files: `**/*.test.*`, `**/*.spec.*`

## Examples

### Next.js Project

```json
// tsconfig.json
{
  "extends": "@eslint-sample/typescript-config/next",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### React Library

```json
// tsconfig.json
{
  "extends": "@eslint-sample/typescript-config/library",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### React Application

```json
// tsconfig.json
{
  "extends": "@eslint-sample/typescript-config/react",
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

## Development

This package is part of the ESLint Sample monorepo. The configurations are designed to work together with the `@eslint-sample/eslint-config` package for a complete development setup.

## License

MIT
