/**
 * Core types and interfaces for the CLI package
 * Re-exports Zod-validated types for consistency
 */

import type {
  CategoryConfig,
  ExportConfig,
  ExportGeneratorOptions,
  ExportsConfigFile,
  PackageExport,
  PackageJson,
} from "@/schemas/validation";

export interface PackageInfo {
  /** Package name */
  name: string;
  /** Absolute path to the package directory */
  path: string;
  /** Relative path from monorepo root */
  relativePath: string;
  /** Current package.json content */
  packageJson: PackageJson;
  /** Detected exports from source files */
  detectedExports: PackageExport[];
}

export interface FileScanner {
  /** Scan a package directory for exportable files */
  scanPackage: (packagePath: string) => Promise<PackageExport[]>;
  /** Filter exports based on patterns */
  filterExports: (exports: PackageExport[], includePatterns?: string[], excludePatterns?: string[]) => PackageExport[];
  /** Configure category mappings for export categorization */
  setCategoryConfig?: (config: CategoryConfig) => void;
}

export interface ExportGenerator {
  /** Generate exports configuration for a package */
  generateExports: (exports: PackageExport[], options: ExportGeneratorOptions) => Record<string, unknown>;
  /** Generate exports with custom patterns */
  generateCustomExports: (
    exports: PackageExport[],
    options: ExportGeneratorOptions,
    customMappings?: Record<string, string>,
  ) => Record<string, unknown>;
  /** Validate generated exports configuration */
  validateExports: (exports: Record<string, unknown>) => boolean;
  /** Generate exports summary for logging */
  generateSummary: (exports: Record<string, unknown>) => string;
}

export interface PackageManager {
  /** Update package.json with new exports */
  updatePackageJson: (packagePath: string, exports: Record<string, unknown>) => Promise<void>;
  /** Read package.json from a directory */
  readPackageJson: (packagePath: string) => Promise<PackageJson>;
  /** Backup package.json before making changes */
  backupPackageJson: (packagePath: string) => Promise<string>;
}

export interface Logger {
  /** Log info message */
  info: (message: string) => void;
  /** Log success message */
  success: (message: string) => void;
  /** Log warning message */
  warn: (message: string) => void;
  /** Log error message */
  error: (message: string) => void;
  /** Start a spinner with a message */
  startSpinner: (message: string) => void;
  /** Stop the current spinner with a success message */
  stopSpinner: (message?: string) => void;
  /** Stop the current spinner with an error message */
  failSpinner: (message?: string) => void;
}

export interface ConfigLoader {
  /** Load exports configuration from a file */
  loadConfig: (configPath?: string) => Promise<ExportsConfigFile | null>;
  /** Find a configuration file in a project */
  findConfigFile: (startPath?: string) => Promise<string | null>;
  /** Merge global and package-specific configuration */
  mergeConfig: (global: ExportConfig | undefined, packageConfig: ExportConfig | undefined) => ExportConfig;
}

export interface CLICommand<T = unknown> {
  /** Command name */
  name: string;
  /** Command description */
  description: string;
  /** Execute the command */
  execute: (args: T) => Promise<void>;
  /** Validate command options */
  validateOptions?: (args: T) => void;
}

export type {
  ExportPriorityConfig,
  GenerateExportsOptions,
  PackageExport,
  PackageJson,
  CategoryConfig,
  ExportGeneratorOptions,
  ExportConfig,
  ExportsConfigFile,
} from "@/schemas/validation";
