import { baseJavaScriptRules } from "@/core/base";
import { importRules } from "@/core/import";
import { securityRules } from "@/core/security";
import { typescriptRules } from "@/core/typescript";
import { unicornRules } from "@/core/unicorn";
import { nodeEnvironment } from "@/environments/node";
import { cssRules } from "@/languages/css";
import { jsonRules } from "@/languages/json";
import { markdownRules } from "@/languages/markdown";
import { composeConfig } from "@/utils/composer";
import { prettierRules } from "@/utils/prettier";

import type { Linter } from "eslint";

// Base preset - foundation configuration for most projects
export const basePreset: Linter.Config[] = composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  securityRules,
  unicornRules,
  importRules,
  nodeEnvironment,
  jsonRules,
  markdownRules,
  cssRules,
  prettierRules,
);

export default basePreset;
