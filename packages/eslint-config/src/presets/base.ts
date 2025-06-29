import type { Linter } from "eslint";

import { baseJavaScriptRules } from "@/core/base";
import { importRules } from "@/core/import";
import { securityRules } from "@/core/security";
import { typescriptRules } from "@/core/typescript";
// import { sonarjsRules } from "@/core/sonarjs"; // Temporarily disabled due to compatibility issues
import { unicornRules } from "@/core/unicorn";
import { nodeEnvironment } from "@/environments/node";
import { cssRules } from "@/languages/css";
import { jsonRules } from "@/languages/json";
import { markdownRules } from "@/languages/markdown";
import { composeConfig } from "@/utils/composer";
import { prettierRules } from "@/utils/prettier";

// Base preset - foundation configuration for most projects
export const basePreset: Linter.Config[] = composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  securityRules,
  // sonarjsRules, // Temporarily disabled due to compatibility issues
  unicornRules,
  importRules,
  nodeEnvironment,
  jsonRules,
  markdownRules,
  cssRules,
  prettierRules,
);

export default basePreset;
