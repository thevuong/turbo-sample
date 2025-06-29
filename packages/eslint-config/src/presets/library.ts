import type { Linter } from "eslint";

import { basePreset } from "@/presets/base";
import { composeConfig } from "@/utils/composer";

// Library preset - stricter rules for library development
const libraryStrictRules: Linter.Config[] = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      // Stricter rules for libraries
      "no-console": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];

export const libraryPreset: Linter.Config[] = composeConfig(basePreset, libraryStrictRules);

export default libraryPreset;
