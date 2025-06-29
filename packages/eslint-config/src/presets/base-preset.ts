import { importRules } from "@/core/import";
import { baseJavaScriptRules } from "@/core/javascript";
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

/**
 * Base preset configuration for most JavaScript/TypeScript projects
 *
 * This preset combines essential ESLint configurations to provide a solid foundation
 * for modern JavaScript and TypeScript development. It includes:
 *
 * - **Core JavaScript rules**: Modern ES6+ practices and code quality
 * - **TypeScript support**: Full TypeScript linting with type-aware rules
 * - **Security rules**: Protection against common security vulnerabilities
 * - **Import/export rules**: Proper module system usage and organization
 * - **Code quality**: Unicorn plugin for additional best practices
 * - **Node.js environment**: Node.js-specific globals and practices
 * - **Multi-language support**: JSON, Markdown, and CSS linting
 * - **Prettier integration**: Automatic formatting conflict resolution
 *
 * Perfect for:
 * - Node.js applications and libraries
 * - TypeScript projects
 * - Full-stack applications (backend/CLI tools)
 * - npm packages and libraries
 *
 * @example
 * ```typescript
 * // eslint.config.js
 * import { basePreset } from '@eslint-sample/eslint-config';
 *
 * export default [
 *   ...basePreset,
 *   // your project-specific overrides
 * ];
 * ```
 *
 * @example
 * ```typescript
 * // For customization, you can compose with additional rules
 * import { basePreset, reactRules } from '@eslint-sample/eslint-config';
 *
 * export default [
 *   ...basePreset,
 *   ...reactRules, // Add React support
 *   {
 *     rules: {
 *       // Your custom rules
 *     }
 *   }
 * ];
 * ```
 */
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
