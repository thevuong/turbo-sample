/**
 * File processing service interfaces
 *
 * These interfaces define contracts for file scanning and export generation operations.
 * Following Single Responsibility and Interface Segregation Principles.
 */

import type { CategoryConfig, ExportGeneratorOptions, PackageExport } from "@/schemas/validation";

/**
 * Interface Segregation: Separate file scanning from export generation
 */
export interface FileScanner {
  /** Scan a package directory for exportable files */
  scanPackage: (packagePath: string) => Promise<PackageExport[]>;
  /** Filter exports based on patterns */
  filterExports: (exports: PackageExport[], includePatterns?: string[], excludePatterns?: string[]) => PackageExport[];
  /** Configure category mappings for export categorization */
  setCategoryConfig?: (config: CategoryConfig) => void;
}

/**
 * Interface Segregation: Separate export generation from file scanning
 */
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
