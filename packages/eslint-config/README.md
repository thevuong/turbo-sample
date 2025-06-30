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
import reactAppPreset from "@eslint-sample/eslint-config/react";

export default reactAppPreset;
```

### For Next.js Applications

```javascript
// eslint.config.js
import nextAppPreset from "@eslint-sample/eslint-config/next";

export default nextAppPreset;
```

### For Libraries

```javascript
// eslint.config.js
import libraryPreset from "@eslint-sample/eslint-config/library";

export default libraryPreset;
```

### For Basic Projects

```javascript
// eslint.config.js
import basePreset from "@eslint-sample/eslint-config/base";

export default basePreset;
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
import baseJavaScriptRules from "@eslint-sample/eslint-config/core/javascript";
import typescriptRules from "@eslint-sample/eslint-config/core/typescript";
import importRules from "@eslint-sample/eslint-config/core/import";
import securityRules from "@eslint-sample/eslint-config/core/security";
import unicornRules from "@eslint-sample/eslint-config/core/unicorn";
```

### Environment Configurations

```javascript
import nodeEnvironment from "@eslint-sample/eslint-config/environments/node";
import browserEnvironment from "@eslint-sample/eslint-config/environments/browser";
```

### Framework Configurations

```javascript
import reactRules from "@eslint-sample/eslint-config/frameworks/react";
import nextRules from "@eslint-sample/eslint-config/frameworks/next";
import jsxA11yRules from "@eslint-sample/eslint-config/frameworks/jsx-a11y";
```

### Language Support

```javascript
import jsonRules from "@eslint-sample/eslint-config/languages/json";
import markdownRules from "@eslint-sample/eslint-config/languages/markdown";
import cssRules from "@eslint-sample/eslint-config/languages/css";
```

### Testing Configurations

```javascript
import jestRules from "@eslint-sample/eslint-config/testing/jest";
```

### Utilities

```javascript
import composeConfig from "@eslint-sample/eslint-config/utils/composer";
import prettierRules from "@eslint-sample/eslint-config/utils/prettier";
import onlyWarnRules from "@eslint-sample/eslint-config/utils/only-warn";
import turboRules from "@eslint-sample/eslint-config/utils/turbo";
```

## Custom Configuration Example

```javascript
// eslint.config.js
import composeConfig from "@eslint-sample/eslint-config/utils/composer";
import baseJavaScriptRules from "@eslint-sample/eslint-config/core/javascript";
import typescriptRules from "@eslint-sample/eslint-config/core/typescript";
import reactRules from "@eslint-sample/eslint-config/frameworks/react";
import nodeEnvironment from "@eslint-sample/eslint-config/environments/node";
import prettierRules from "@eslint-sample/eslint-config/utils/prettier";

export default composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  reactRules,
  nodeEnvironment,
  prettierRules,
  // Your custom rules
  {
    rules: {
      "no-console": "warn",
    },
  },
);
```

## Alternative Import Methods

The package supports multiple import patterns for flexibility:

### Named Exports from Main Entry

```javascript
// Import multiple configurations from the main entry point
import {
  basePreset,
  reactAppPreset,
  baseJavaScriptRules,
  typescriptRules,
  composeConfig,
} from "@eslint-sample/eslint-config";

export default composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  // Add your custom rules
);
```

### Direct Path Imports

```javascript
// Import directly from specific paths (shown in examples above)
import basePreset from "@eslint-sample/eslint-config/base";
import reactRules from "@eslint-sample/eslint-config/frameworks/react";
```

### Preset Path Variations

```javascript
// Short preset paths
import basePreset from "@eslint-sample/eslint-config/base";
import reactAppPreset from "@eslint-sample/eslint-config/react";

// Full preset paths
import basePreset from "@eslint-sample/eslint-config/presets/base";
import reactAppPreset from "@eslint-sample/eslint-config/presets/react-app";
```

## Included Plugins

This configuration includes the following ESLint plugins and parsers:

- **@eslint/js** - Core JavaScript rules
- **@eslint/css** - CSS linting support
- **@eslint/json** - JSON file linting
- **@eslint/markdown** - Markdown file linting
- **typescript-eslint** - TypeScript-specific rules and parser
- **eslint-plugin-import** - Import/export rules and validation
- **eslint-import-resolver-typescript** - TypeScript import resolution
- **eslint-plugin-react** - React-specific rules
- **eslint-plugin-react-hooks** - React Hooks rules
- **@next/eslint-plugin-next** - Next.js-specific rules
- **eslint-plugin-jsx-a11y** - Accessibility rules for JSX
- **eslint-plugin-unicorn** - Additional useful rules and best practices
- **eslint-plugin-security** - Security-focused rules
- **eslint-plugin-jest** - Jest testing rules
- **eslint-plugin-turbo** - Turborepo-specific rules
- **eslint-plugin-only-warn** - Convert errors to warnings
- **eslint-config-prettier** - Prettier integration and conflict resolution
- **globals** - Global variables definitions for different environments

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
