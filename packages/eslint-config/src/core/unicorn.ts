import pluginUnicorn from "eslint-plugin-unicorn";

import type { Linter } from "eslint";

// Unicorn rules - promote modern best practices
export const unicornRules: Linter.Config[] = [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      ...pluginUnicorn.configs.recommended.rules,
      // Customize some rules for a better developer experience
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          replacements: {
            props: false, // Allow 'props' in React
            ref: false, // Allow 'ref' in React
            params: false, // Allow 'params'
            args: false, // Allow 'args'
            env: false, // Allow 'env'
            dev: false, // Allow 'dev'
            prod: false, // Allow 'prod'
            temp: false, // Allow 'temp'
            tmp: false, // Allow 'tmp'
          },
        },
      ],
      "unicorn/no-array-reduce": "off", // Reduce is useful in many cases
      "unicorn/no-null": "off", // Allow null for compatibility
      "unicorn/prefer-top-level-await": "off", // Not always appropriate
      "unicorn/prefer-module": "off", // Allow CommonJS when needed
      "unicorn/no-process-exit": "off", // Allow process.exit in Node.js apps
      "unicorn/prefer-node-protocol": "error", // Use node: protocol for built-ins
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-math-trunc": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/prefer-string-trim-start-end": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/throw-new-error": "error",
    },
  },
];

export default unicornRules;
