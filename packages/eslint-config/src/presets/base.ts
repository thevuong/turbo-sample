import { baseJavaScriptRules } from '@/core/base';
import { typescriptRules } from '@/core/typescript';
import { nodeEnvironment } from '@/environments/node';
import { jsonRules } from '@/languages/json';
import { markdownRules } from '@/languages/markdown';
import { cssRules } from '@/languages/css';
import { prettierRules } from '@/utils/prettier';
import { composeConfig } from '@/utils/composer';
import type { Linter } from "eslint";

// Base preset - foundation configuration for most projects
export const basePreset: Linter.Config[] = composeConfig(
  baseJavaScriptRules,
  typescriptRules,
  nodeEnvironment,
  jsonRules,
  markdownRules,
  cssRules,
  prettierRules
);

export default basePreset;
