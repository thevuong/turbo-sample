// Configuration for exports generation
// This file defines which files should be exported from each package

/**
 * Exports configuration for the monorepo
 * This file controls which files are exported from each package
 */
const config = {
  // Global configuration applied to all packages
  global: {
    // Exclude common patterns that shouldn't be exported
    exclude: [
      "**/*.test.*",
      "**/*.spec.*",
      "**/tests/**",
      "**/test/**",
      "**/__tests__/**",
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
    ],
    dualFormat: true,
  },

  // Package-specific configurations
  packages: {
    // CLI package - only export the main entry point and types, exclude internal services
    "@eslint-sample/cli": {
      include: ["index.*", "types/**"],
      exclude: ["services/**", "commands/**", "bin/**"],
      dualFormat: true,
    },

    // ESLint config package - export all configurations for user consumption
    "@eslint-sample/eslint-config": {
      include: ["**/*.ts", "**/*.js", "**/*.json"],
      exclude: [
        // Only exclude test files, allow all other exports
      ],
      dualFormat: true,
    },

    // TypeScript config package - export all JSON configs
    "@eslint-sample/typescript-config": {
      include: ["*.json"],
      dualFormat: false, // JSON files don't need a dual format
    },
  },
};

export default config;
