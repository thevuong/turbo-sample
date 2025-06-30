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
  exports?: Record<string, any>;
  main?: string;
  module?: string;
  types?: string;
  [key: string]: any;
}

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
}

export interface FileScanner {
  /** Scan a package directory for exportable files */
  scanPackage: (packagePath: string) => Promise<PackageExport[]>;
  /** Filter exports based on patterns */
  filterExports: (exports: PackageExport[], includePatterns?: string[], excludePatterns?: string[]) => PackageExport[];
}

export interface ExportGenerator {
  /** Generate exports configuration for a package */
  generateExports: (exports: PackageExport[], options: ExportGeneratorOptions) => Record<string, any>;
  /** Generate exports with custom patterns */
  generateCustomExports: (
    exports: PackageExport[],
    options: ExportGeneratorOptions,
    customMappings?: Record<string, string>,
  ) => Record<string, any>;
  /** Validate generated exports configuration */
  validateExports: (exports: Record<string, any>) => boolean;
  /** Generate exports summary for logging */
  generateSummary: (exports: Record<string, any>) => string;
}

export interface PackageManager {
  /** Update package.json with new exports */
  updatePackageJson: (packagePath: string, exports: Record<string, any>) => Promise<void>;
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

export interface CLICommand {
  /** Command name */
  name: string;
  /** Command description */
  description: string;
  /** Execute the command */
  execute: (args: any) => Promise<void>;
  /** Validate command options */
  validateOptions?: (args: any) => void;
}
