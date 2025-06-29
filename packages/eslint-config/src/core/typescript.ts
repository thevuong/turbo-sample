import tseslint from "typescript-eslint";
import type { Linter } from "eslint";

// TypeScript-specific rules
export const typescriptRules: Linter.Config[] = [
  ...(tseslint.configs.recommended as Linter.Config[]),
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    rules: {
      // Override TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off", // Allow inference by default
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error"
    }
  }
];

export default typescriptRules;
