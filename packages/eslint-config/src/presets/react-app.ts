import type { Linter } from "eslint";

import { baseJavaScriptRules } from "@/core/base";
import { importRules } from "@/core/import";
import { securityRules } from "@/core/security";
import { typescriptRules } from "@/core/typescript";
// import { sonarjsRules } from "@/core/sonarjs"; // Temporarily disabled due to compatibility issues
import { unicornRules } from "@/core/unicorn";
import { browserEnvironment } from "@/environments/browser";
import { jsxA11yRules } from "@/frameworks/jsx-a11y";
import { reactRules } from "@/frameworks/react";
import { cssRules } from "@/languages/css";
import { jsonRules } from "@/languages/json";
import { markdownRules } from "@/languages/markdown";
import { jestRules } from "@/testing/jest";
import { composeConfig } from "@/utils/composer";

// React app preset - configuration for React applications
export const reactAppPreset: Linter.Config[] = composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  securityRules,
  // sonarjsRules, // Temporarily disabled due to compatibility issues
  unicornRules,
  importRules,
  browserEnvironment,
  jsonRules,
  markdownRules,
  cssRules,
  reactRules,
  jsxA11yRules,
  jestRules,
);

export default reactAppPreset;
