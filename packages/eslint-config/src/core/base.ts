import js from "@eslint/js";
import type { Linter } from "eslint";

// Core JavaScript rules - foundation for all configurations
export const baseJavaScriptRules: Linter.Config[] = [
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
      // Additional base rules
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console in base, override in specific configs
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];

export default baseJavaScriptRules;