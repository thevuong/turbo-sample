/**
 * @eslint-sample/cli - CLI tool for managing package.json exports in monorepo packages
 *
 * This package provides a command-line interface for automatically generating
 * package.json exports based on source files in monorepo packages.
 *
 * Features:
 * - Automatic detection of exportable files
 * - Support for both ESM and CJS dual-format exports
 * - TypeScript definition generation
 * - Customizable export mappings
 * - Backup and dry-run modes
 * - Monorepo-aware package discovery
 */

// Export types
export type {
  PackageExport,
  PackageInfo,
  PackageJson,
  ExportGeneratorOptions,
  FileScanner,
  ExportGenerator,
  PackageManager,
  Logger,
  CLICommand,
  ExportsConfigFile,
  ConfigLoader,
  ExportConfig,
  CategoryConfig,
  ExportPriorityConfig,
} from "@/types/index";

// Export services
export { createLogger, ConsoleLogger } from "@/services/logger";

export { createPackageManager, FileSystemPackageManager } from "@/services/package-manager";

export { createFileScanner, GlobFileScanner } from "@/services/file-scanner";

export { createExportGenerator, StandardExportGenerator, DEFAULT_EXPORT_OPTIONS } from "@/services/export-generator";

// Export commands
export {
  createGenerateExportsCommand,
  GenerateExportsCommand,
  type GenerateExportsOptions,
} from "@/commands/generate-exports";

// Export CLI application
export { CLIApplication } from "@/bin/cli";
