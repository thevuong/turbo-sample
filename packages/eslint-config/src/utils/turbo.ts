import pluginTurbo from "eslint-plugin-turbo";

import type { Linter } from "eslint";

// Turbo configuration - linting rules for Turborepo monorepos
export const turboRules: Linter.Config[] = [
  {
    plugins: {
      turbo: pluginTurbo,
    },
    rules: {
      ...pluginTurbo.configs.recommended.rules,
    },
  },
];

export default turboRules;
