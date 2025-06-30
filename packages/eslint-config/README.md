# @eslint-sample/eslint-config

A comprehensive, modular ESLint configuration package designed for modern JavaScript and TypeScript projects. This
package provides atomic configurations that can be composed together to create tailored linting setups for different
project types.

## Features

- 🎯 **Modular Design**: Atomic configurations that can be mixed and matched
- 🚀 **Multiple Presets**: Ready-to-use configurations for different project types
- 📦 **Dual Module Support**: Both ESM and CommonJS compatibility
- 🔧 **TypeScript First**: Full TypeScript support with strict type checking
- ⚛️ **Framework Support**: Specialized configurations for React and Next.js
- 🛡️ **Security**: Built-in security rules and best practices
- 🎨 **Prettier Integration**: Seamless integration with Prettier
- 📝 **Multiple Languages**: Support for JSON, Markdown, and CSS

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @eslint-sample/eslint-config

# Using npm
npm install --save-dev @eslint-sample/eslint-config

# Using yarn
yarn add -D @eslint-sample/eslint-config
```

## Quick Start

### For React Applications

```javascript
// eslint.config.js
import { reactApp } from "@eslint-sample/eslint-config/react";

export default reactApp;
```

### For Next.js Applications

```javascript
// eslint.config.js
import { nextApp } from "@eslint-sample/eslint-config/next";

export default nextApp;
```

### For Libraries

```javascript
// eslint.config.js
import { library } from "@eslint-sample/eslint-config/library";

export default library;
```

### For Basic Projects

```javascript
// eslint.config.js
import { base } from "@eslint-sample/eslint-config/base";

export default base;
```

## Available Presets

| Preset    | Description                       | Use Case                             |
| --------- | --------------------------------- | ------------------------------------ |
| `base`    | Core JavaScript/TypeScript rules  | Basic projects, Node.js applications |
| `library` | Library-focused configuration     | NPM packages, shared libraries       |
| `react`   | React application configuration   | React SPAs, component libraries      |
| `next`    | Next.js application configuration | Next.js applications                 |

## Modular Configurations

For advanced users who want to compose their own configurations:

### Core Configurations

```javascript
import { javascript } from "@eslint-sample/eslint-config/core/javascript";
import { typescript } from "@eslint-sample/eslint-config/core/typescript";
import { importRules } from "@eslint-sample/eslint-config/core/import";
import { security } from "@eslint-sample/eslint-config/core/security";
import { unicorn } from "@eslint-sample/eslint-config/core/unicorn";
```

### Environment Configurations

```javascript
import { node } from "@eslint-sample/eslint-config/environments/node";
import { browser } from "@eslint-sample/eslint-config/environments/browser";
```

### Framework Configurations

```javascript
import { react } from "@eslint-sample/eslint-config/frameworks/react";
import { next } from "@eslint-sample/eslint-config/frameworks/next";
import { jsxA11y } from "@eslint-sample/eslint-config/frameworks/jsx-a11y";
```

### Language Support

```javascript
import { json } from "@eslint-sample/eslint-config/languages/json";
import { markdown } from "@eslint-sample/eslint-config/languages/markdown";
import { css } from "@eslint-sample/eslint-config/languages/css";
```

### Testing Configurations

```javascript
import { jest } from "@eslint-sample/eslint-config/testing/jest";
```

### Utilities

```javascript
import { composer } from "@eslint-sample/eslint-config/utils/composer";
import { prettier } from "@eslint-sample/eslint-config/utils/prettier";
import { onlyWarn } from "@eslint-sample/eslint-config/utils/only-warn";
import { turbo } from "@eslint-sample/eslint-config/utils/turbo";
```

## Custom Configuration Example

```javascript
// eslint.config.js
import { composer } from "@eslint-sample/eslint-config/utils/composer";
import { javascript } from "@eslint-sample/eslint-config/core/javascript";
import { typescript } from "@eslint-sample/eslint-config/core/typescript";
import { react } from "@eslint-sample/eslint-config/frameworks/react";
import { node } from "@eslint-sample/eslint-config/environments/node";
import { prettier } from "@eslint-sample/eslint-config/utils/prettier";

export default composer(
  javascript,
  typescript,
  react,
  node,
  prettier,
  // Your custom rules
  {
    rules: {
      "no-console": "warn",
    },
  },
);
```

## Included Plugins

This configuration includes the following ESLint plugins:

- **@eslint/js** - Core JavaScript rules
- **typescript-eslint** - TypeScript-specific rules
- **eslint-plugin-import** - Import/export rules
- **eslint-plugin-react** - React-specific rules
- **eslint-plugin-react-hooks** - React Hooks rules
- **@next/eslint-plugin-next** - Next.js-specific rules
- **eslint-plugin-jsx-a11y** - Accessibility rules for JSX
- **eslint-plugin-unicorn** - Additional useful rules
- **eslint-plugin-security** - Security-focused rules
- **eslint-plugin-jest** - Jest testing rules
- **eslint-plugin-turbo** - Turborepo-specific rules
- **eslint-plugin-only-warn** - Convert errors to warnings
- **eslint-config-prettier** - Prettier integration

## Language Support

- **JavaScript** (ES2022+)
- **TypeScript** (with strict type checking)
- **JSX/TSX** (React components)
- **JSON** (configuration files)
- **Markdown** (documentation)
- **CSS** (stylesheets)

## Configuration Philosophy

This ESLint configuration follows these principles:

1. **Strict by Default**: Enforces best practices and catches potential bugs
2. **Framework Aware**: Provides specialized rules for different frameworks
3. **Security Focused**: Includes security rules to prevent common vulnerabilities
4. **Performance Conscious**: Optimized rules that don't slow down development
5. **Accessibility First**: Includes a11y rules for better user experience
6. **Modern JavaScript**: Supports latest ECMAScript features

## Development

### Building the Package

```bash
# Build the package
pnpm build

# Build in watch mode
pnpm dev

# Clean build artifacts
pnpm clean
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Linting

```bash
# Lint the package
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Requirements

- **Node.js**: >= 18.0.0
- **ESLint**: ^9.30.0
- **TypeScript**: ^5.8.3 (for TypeScript projects)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`pnpm test`)
6. Ensure linting passes (`pnpm lint`)
7. Commit your changes (`git commit -m 'Add some amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

MIT © ESLint Sample Team
