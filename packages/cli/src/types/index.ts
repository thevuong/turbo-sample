/**
 * Core types and interfaces for the CLI package
 */

export interface PackageExport {
  /** The export key (e.g., ".", "./base", "./react") */
  key: string;
  /** The source file path relative to package root */
  sourcePath: string;
  /** Whether this export supports both ESM and CJS */
  dualFormat: boolean;
  /** Whether this export has TypeScript definitions */
  hasTypes: boolean;
}

export interface PackageInfo {
  /** Package name */
  name: string;
  /** Absolute path to package directory */
  path: string;
  /** Relative path from monorepo root */
  relativePath: string;
  /** Current package.json content */
  packageJson: PackageJson;
  /** Detected exports from source files */
  detectedExports: PackageExport[];
}

export interface PackageJson {
  name: string;
  version: string;
  type?: "module" | "commonjs";
  exports?: Record<string, unknown>;
  main?: string;
  module?: string;
  types?: string;
  [key: string]: unknown;
}

export type ExportPriorityConfig = Record<string, number>;

export type CategoryConfig = Record<string, string>;

export interface ExportGeneratorOptions {
  /** Whether to generate dual format exports (ESM + CJS) */
  dualFormat: boolean;
  /** Base directory for built files */
  distDir: string;
  /** ESM output directory relative to distDir */
  esmDir: string;
  /** CJS output directory relative to distDir */
  cjsDir: string;
  /** File extensions for different formats */
  extensions: {
    esm: string;
    cjs: string;
    types: string;
  };
  /** Custom export priority configuration (optional) */
  exportPriorities?: ExportPriorityConfig;
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
  /** Start a spinner with message */
  startSpinner: (message: string) => void;
  /** Stop current spinner with success message */
  stopSpinner: (message?: string) => void;
  /** Stop current spinner with error message */
  failSpinner: (message?: string) => void;
}

export interface ExportConfig {
  /** Include patterns for files to export */
  include?: string[];
  /** Exclude patterns for files to exclude from exports */
  exclude?: string[];
  /** Custom export mappings */
  mappings?: Record<string, string>;
  /** Whether to generate dual format exports */
  dualFormat?: boolean;
  /** Package-specific export priorities */
  exportPriorities?: ExportPriorityConfig;
}

export interface ExportsConfigFile {
  /** Global configuration applied to all packages */
  global?: ExportConfig;
  /** Package-specific configurations */
  packages?: Record<string, ExportConfig>;
}

export interface ConfigLoader {
  /** Load exports configuration from file */
  loadConfig: (configPath?: string) => Promise<ExportsConfigFile | null>;
  /** Find configuration file in project */
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
