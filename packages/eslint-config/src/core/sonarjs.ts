import pluginSonarjs from "eslint-plugin-sonarjs";

import type { Linter } from "eslint";

// SonarJS rules - detect code smells and bugs
export const sonarjsRules: Linter.Config[] = [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      sonarjs: pluginSonarjs,
    },
    rules: {
      ...pluginSonarjs.configs.recommended.rules,
      // Customize some rules for better compatibility
      "sonarjs/cognitive-complexity": ["error", 15], // Limit cognitive complexity
      "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
    },
  },
];

export default sonarjsRules;
