# @eslint-sample/typescript-config

Shared TypeScript configurations for different project types. This package provides optimized
`tsconfig.json` configurations that can be extended for various use cases including libraries, React applications,
Next.js applications, and base projects.

## Features

- 🎯 **Multiple Configurations**: Four tailored configs for different project types
- 🚀 **Modern TypeScript**: Uses ES2022 target with ESNext modules and bundler resolution
- 📦 **Extensible**: All configurations extend from a common base configuration
- 🔧 **Strict Mode**: Comprehensive strict type checking enabled by default
- ⚛️ **Framework Ready**: Specialized configurations for React and Next.js with proper JSX handling
- 📚 **Library Optimized**: Dedicated configuration with build output and path mapping

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
- **Strict Mode**: Comprehensive strict checks including `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- **Libraries**: ES2022 standard library
- **Declaration**: Generates `.d.ts` files and declaration maps
- **Source Maps**: Enabled for debugging
- **Includes**: All TypeScript and TSX files
- **Excludes**: node_modules, dist, build, coverage, test files

### Library Configuration

Extends base configuration with:

- **Output Directory**: `./dist` for build output
- **Path Mapping**: `@/*` alias pointing to `./src/*`
- **Incremental**: Enabled for faster builds
- **Strip Internal**: Removes internal declarations from output
- **Additional Excludes**: Stories, tests, and mock directories

### React Configuration

Extends base configuration with:

- **JSX**: `react-jsx` transform for modern React
- **DOM Libraries**: Includes DOM, DOM.Iterable, and ES2022
- **Target**: ES2020 (optimized for React)
- **Path Mapping**: Both `@/*` (src) and `~/*` (root) aliases

### Next.js Configuration

Extends base configuration with:

- **JSX**: `preserve` for Next.js compilation
- **Target**: ES2017 (Next.js compatibility)
- **DOM Libraries**: Includes DOM, DOM.Iterable, and ES2022
- **Incremental**: Enabled for faster builds
- **Next.js Plugin**: Official Next.js TypeScript plugin
- **Path Mapping**: Both `@/*` (src) and `~/*` (root) aliases
- **Next.js Includes**: next-env.d.ts and .next/types files

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

```json5
// tsconfig.build.json
{
  extends: "./tsconfig.json",
  exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "tests/**/*", "**/__tests__/**/*"],
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

### Base Configuration Options

```json
{
  "allowJs": true,
  "allowSyntheticDefaultImports": true,
  "declaration": true,
  "declarationMap": true,
  "esModuleInterop": true,
  "exactOptionalPropertyTypes": true,
  "forceConsistentCasingInFileNames": true,
  "isolatedModules": true,
  "lib": ["ES2022"],
  "module": "ESNext",
  "moduleResolution": "bundler",
  "noEmit": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true,
  "noImplicitReturns": true,
  "noPropertyAccessFromIndexSignature": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": false,
  "noUnusedParameters": false,
  "resolveJsonModule": true,
  "skipLibCheck": true,
  "sourceMap": true,
  "strict": true,
  "target": "ES2022"
}
```

### Library Configuration Overrides

```json
{
  "emitDeclarationOnly": false,
  "incremental": true,
  "noEmit": false,
  "outDir": "./dist",
  "paths": {
    "@/*": ["./src/*"]
  },
  "removeComments": false,
  "stripInternal": true
}
```

### React Configuration Overrides

```json
{
  "jsx": "react-jsx",
  "lib": ["DOM", "DOM.Iterable", "ES2022"],
  "target": "ES2020",
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./"]
  }
}
```

### Next.js Configuration Overrides

```json
{
  "incremental": true,
  "jsx": "preserve",
  "lib": ["DOM", "DOM.Iterable", "ES2022"],
  "target": "ES2017",
  "plugins": [
    {
      "name": "next"
    }
  ],
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./"]
  }
}
```

## Requirements

- **TypeScript**: >= 5.0.0 (to be installed in your project)
- **Node.js**: >= 18.0.0

> **Note**: This package provides TypeScript configuration files only. You need to install TypeScript in your project to
> use these configurations.

## Best Practices

1. **Use Appropriate Configuration**: Choose the configuration that matches your project type
2. **Extend Don't Replace**: Extend configurations rather than copying them
3. **Path Mapping**: Use path mapping for cleaner imports
4. **Separate Build Config**: Use separate `tsconfig.build.json` for production builds
5. **Include/Exclude**: Be specific about what files to include and exclude

## Troubleshooting

### Common Issues

**Path Mapping Not Working**

The library and React/Next.js configurations include path mapping. Make sure your project structure matches:

```json5
{
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
      // Library config
      "~/*": ["./"],
      // React/Next.js configs only
    },
  },
}
```

**Strict Type Checking Errors**

This package enables comprehensive strict checking. If you encounter errors with `exactOptionalPropertyTypes` or
`noUncheckedIndexedAccess`, you can override them:

```json5
{
  extends: "@eslint-sample/typescript-config/base",
  compilerOptions: {
    exactOptionalPropertyTypes: false,
    noUncheckedIndexedAccess: false,
  },
}
```

**Next.js Build Issues**

The Next.js configuration uses `jsx: "preserve"` and `target: "ES2017"`. If you encounter issues, ensure your Next.js
version supports these settings:

```json5
{
  extends: "@eslint-sample/typescript-config/next",
  compilerOptions: {
    target: "ES2020",
    // Override if needed
  },
}
```

**Library Build Output Issues**

The library configuration outputs to `./dist`. Make sure this directory exists or adjust the path:

```json5
{
  extends: "@eslint-sample/typescript-config/library",
  compilerOptions: {
    outDir: "./build",
    // Custom output directory
  },
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
