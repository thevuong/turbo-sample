import tseslint from "typescript-eslint";
import type { Linter } from "eslint";

// TypeScript-specific rules
export const typescriptRules: Linter.Config[] = [
  // Basic TypeScript rules for all TypeScript files
  ...(tseslint.configs.recommended as Linter.Config[]),
  // Type-checked rules only for TypeScript files with proper parser options
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      // Type-aware rules that require project configuration
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "error",
    }
  },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    rules: {
      // Override TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off", // Allow inference by default
      "@typescript-eslint/no-explicit-any": "warn",
    }
  }
];

export default typescriptRules;
