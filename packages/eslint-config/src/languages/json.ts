import json from "@eslint/json";
import type { Linter } from "eslint";

// JSON file configuration
export const jsonRules: Linter.Config[] = [
  {
    files: ["**/*.json"],
    plugins: { json } as any,
    language: "json/json",
    rules: {
      ...json.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json } as any,
    language: "json/jsonc",
    rules: {
      ...json.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.json5"],
    plugins: { json } as any,
    language: "json/json5",
    rules: {
      ...json.configs.recommended.rules,
    },
  },
];

export default jsonRules;
