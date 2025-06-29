# @eslint-sample/eslint-config

Shared ESLint configuration for the monorepo, providing different configurations for various project types.

## Available Configurations

### Default Configuration

The default export provides a React.js configuration suitable for most React applications.

```javascript
import config from "@eslint-sample/eslint-config";

export default config;
```

### Base Configuration

Basic configuration with common rules for JavaScript/TypeScript projects, JSON, Markdown, and CSS files.

```javascript
import baseConfig from "@eslint-sample/eslint-config/base";

export default baseConfig;
```

### React.js Configuration

Configuration optimized for React.js applications with browser and Node.js globals.

```javascript
import reactConfig from "@eslint-sample/eslint-config/react";

export default reactConfig;
```

### Next.js Configuration

Configuration optimized for Next.js applications, extending the React configuration with Next.js specific rules.

```javascript
import nextConfig from "@eslint-sample/eslint-config/next";

export default nextConfig;
```

### Library Configuration

Configuration for library projects with stricter rules and no browser globals.

```javascript
import libraryConfig from "@eslint-sample/eslint-config/library";

export default libraryConfig;
```

## Features

- **TypeScript Support**: Full TypeScript support with recommended rules
- **React Support**: React plugin with recommended rules and JSX support
- **Multiple File Types**: Support for JSON, Markdown, and CSS files
- **Modular Design**: Choose the configuration that fits your project type
- **ESLint v9 Compatible**: Uses the new flat config format

## Installation

```bash
npm install --save-dev @eslint-sample/eslint-config
# or
pnpm add -D @eslint-sample/eslint-config
```

## Usage Examples

### For a React.js Project

```javascript
// eslint.config.js
import reactConfig from "@eslint-sample/eslint-config/react";

export default reactConfig;
```

### For a Next.js Project

```javascript
// eslint.config.js
import nextConfig from "@eslint-sample/eslint-config/next";

export default nextConfig;
```

### For a Library Project

```javascript
// eslint.config.js
import libraryConfig from "@eslint-sample/eslint-config/library";

export default libraryConfig;
```

### Custom Configuration

You can extend any configuration with your own rules:

```javascript
// eslint.config.js
import baseConfig from "@eslint-sample/eslint-config/base";

export default [
  ...baseConfig,
  {
    rules: {
      // Your custom rules here
      "no-console": "error",
    },
  },
];
```

## Configuration Details

### Base Configuration Includes:

- JavaScript/TypeScript recommended rules
- Node.js globals
- JSON, Markdown, and CSS file support

### React Configuration Adds:

- Browser globals
- React plugin with recommended rules
- JSX support
- React version detection

### Next.js Configuration Adds:

- ES2021 globals
- Next.js specific rule overrides
- Disabled `react/react-in-jsx-scope` (not needed in Next.js)
- Disabled `react/prop-types` (TypeScript handles this)

### Library Configuration Features:

- Stricter rules for library development
- No browser globals (Node.js only)
- Console warnings
- Explicit function return types encouraged
