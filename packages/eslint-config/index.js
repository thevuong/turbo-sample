import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node } 
    }
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    ...tseslint.configs.recommended[0],
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node } 
    }
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node } 
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    rules: {
      ...json.configs.recommended.rules
    }
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    rules: {
      ...json.configs.recommended.rules
    }
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    rules: {
      ...json.configs.recommended.rules
    }
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    rules: {
      ...markdown.configs.recommended.rules
    }
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      ...css.configs.recommended.rules
    }
  }
];
