/**
 * Processing-related types and interfaces for scanning and generating exports
 */

import type { CategoryConfig, ExportGeneratorOptions, PackageExport } from "@/schemas/validation";

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
