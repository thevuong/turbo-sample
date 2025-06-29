import { baseJavaScriptRules } from "@/core/base";
import { typescriptRules } from "@/core/typescript";
import { browserEnvironment } from "@/environments/browser";
import { jsonRules } from "@/languages/json";
import { markdownRules } from "@/languages/markdown";
import { cssRules } from "@/languages/css";
import { reactRules } from "@/frameworks/react";
import { composeConfig } from "@/utils/composer";
import type { Linter } from "eslint";

// React app preset - configuration for React applications
export const reactAppPreset: Linter.Config[] = composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  browserEnvironment,
  jsonRules,
  markdownRules,
  cssRules,
  reactRules
);

export default reactAppPreset;
