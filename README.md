# ESLint Sample Monorepo

This project has been converted from a simple ESLint sample to a monorepo using Turborepo.

## Structure

```
├── apps/
│   └── sample-app/          # Sample application
├── packages/
│   └── eslint-config/       # Shared ESLint configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json with workspaces
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run linting across all packages:

   ```bash
   pnpm lint
   ```

3. Build all packages:

   ```bash
   pnpm build
   ```

4. Run development mode:
   ```bash
   pnpm dev
   ```

## Packages

### @eslint-sample/eslint-config

Shared ESLint configuration that can be used across all apps and packages in the monorepo. It includes configurations for:

- JavaScript/TypeScript
- React
- JSON
- Markdown
- CSS

### @eslint-sample/sample-app

A sample application demonstrating how to use the shared ESLint configuration in a monorepo setup.

## Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Run all packages in development mode
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests for all packages
- `pnpm clean` - Clean build artifacts

## Turborepo Features

This monorepo uses Turborepo for:

- Task orchestration and caching
- Parallel execution of tasks
- Dependency-aware task scheduling
- Remote caching (when configured)
