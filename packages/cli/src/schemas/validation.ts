/**
 * Validation schemas index - Re-exports all schemas for backward compatibility
 *
 * This file maintains backward compatibility while the schemas are now organized
 * by domain following Single Responsibility Principle.
 */

// Re-export package-related schemas
export { packageJsonSchema, type PackageJson } from "./package/package-json";

export {
  packageExportSchema,
  exportGeneratorOptionsSchema,
  type PackageExport,
  type ExportGeneratorOptions,
} from "./package/package-export";

// Re-export configuration schemas
export {
  exportPriorityConfigSchema,
  categoryConfigSchema,
  exportConfigSchema,
  exportsConfigFileSchema,
  type ExportConfig,
  type ExportsConfigFile,
  type ExportPriorityConfig,
  type CategoryConfig,
} from "./configuration/export-config";

export { generateExportsOptionsSchema, type GenerateExportsOptions } from "./configuration/cli-options";
