# @eslint-sample/typescript-config

Shared TypeScript configurations for different project types in the monorepo. This package provides optimized
`tsconfig.json` configurations that can be extended for various use cases including libraries, React applications,
Next.js applications, and base projects.

## Features

- 🎯 **Multiple Configurations**: Tailored configs for different project types
- 🚀 **Modern TypeScript**: Supports latest TypeScript features and best practices
- 📦 **Extensible**: Easy to extend and customize for specific needs
- 🔧 **Strict Mode**: Enforces strict type checking for better code quality
- ⚛️ **Framework Ready**: Specialized configurations for React and Next.js
- 📚 **Library Optimized**: Dedicated configuration for library development

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @eslint-sample/typescript-config

# Using npm
npm install --save-dev @eslint-sample/typescript-config

# Using yarn
yarn add -D @eslint-sample/typescript-config
```

## Available Configurations

| Configuration | Description                       | Use Case                             |
| ------------- | --------------------------------- | ------------------------------------ |
| `base`        | Core TypeScript configuration     | Basic projects, Node.js applications |
| `library`     | Library-focused configuration     | NPM packages, shared libraries       |
| `react`       | React application configuration   | React SPAs, component libraries      |
| `next`        | Next.js application configuration | Next.js applications                 |

## Usage

### For Base Projects

```json
{
  "extends": "@eslint-sample/typescript-config/base"
}
```

### For Libraries

```json
{
  "extends": "@eslint-sample/typescript-config/library"
}
```

### For React Applications

```json
{
  "extends": "@eslint-sample/typescript-config/react"
}
```

### For Next.js Applications

```json
{
  "extends": "@eslint-sample/typescript-config/next"
}
```

## Configuration Details

### Base Configuration

The base configuration provides:

- **Target**: ES2022 for modern JavaScript features
- **Module**: ESNext with bundler resolution
- **Strict Mode**: All strict checks enabled
- **Path Mapping**: Support for `@/` alias pointing to `src/`
- **Declaration**: Generates `.d.ts` files
- **Source Maps**: Enabled for debugging

### Library Configuration

Extends base configuration with:

- **Declaration**: Always generates type definitions
- **Declaration Maps**: For better IDE support
- **Composite**: Enabled for project references
- **Output Directory**: Configured for library builds

### React Configuration

Extends base configuration with:

- **JSX**: React JSX transform
- **DOM Libraries**: Includes DOM and DOM.Iterable
- **Module Resolution**: Optimized for React projects
- **Strict Mode**: Enhanced for React development

### Next.js Configuration

Extends React configuration with:

- **JSX**: Preserve JSX for Next.js compilation
- **Module Resolution**: Next.js specific settings
- **Incremental**: Enabled for faster builds
- **Plugins**: Next.js TypeScript plugin support

## Customization

You can extend any configuration and add your own settings:

```json
{
  "extends": "@eslint-sample/typescript-config/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*", "custom-types/**/*"],
  "exclude": ["dist", "build", "coverage"]
}
```

## Common Patterns

### Monorepo Setup

For packages in a monorepo:

```json
{
  "extends": "@eslint-sample/typescript-config/library",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

### Application with Custom Paths

```json
{
  "extends": "@eslint-sample/typescript-config/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### Build Configuration

For separate build configuration:

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "tests/**/*", "**/__tests__/**/*"]
}
```

## Configuration Philosophy

These TypeScript configurations follow these principles:

1. **Strict by Default**: All strict checks enabled to catch errors early
2. **Modern Standards**: Uses latest TypeScript and ECMAScript features
3. **Framework Aware**: Optimized for specific frameworks and use cases
4. **Developer Experience**: Configured for best IDE support and debugging
5. **Build Optimization**: Efficient compilation and output generation
6. **Type Safety**: Maximum type safety without being overly restrictive

## Included Compiler Options

### Common Options (All Configurations)

```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "strict": true,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true,
  "resolveJsonModule": true,
  "isolatedModules": true,
  "noEmit": false,
  "declaration": true,
  "declarationMap": true,
  "sourceMap": true
}
```

### React/Next.js Specific

```json
{
  "jsx": "react-jsx", // or "preserve" for Next.js
  "lib": ["DOM", "DOM.Iterable", "ES2022"]
}
```

### Library Specific

```json
{
  "composite": true,
  "outDir": "./dist",
  "rootDir": "./src"
}
```

## Requirements

- **TypeScript**: ^5.8.3
- **Node.js**: >= 18.0.0

## Best Practices

1. **Use Appropriate Configuration**: Choose the configuration that matches your project type
2. **Extend Don't Replace**: Extend configurations rather than copying them
3. **Path Mapping**: Use path mapping for cleaner imports
4. **Separate Build Config**: Use separate `tsconfig.build.json` for production builds
5. **Include/Exclude**: Be specific about what files to include and exclude

## Troubleshooting

### Common Issues

**Module Resolution Errors**

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}
```

**Path Mapping Not Working**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**JSX Errors in React Projects**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2022"]
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes to the configuration files
4. Test your changes with different project types
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT © ESLint Sample Team
