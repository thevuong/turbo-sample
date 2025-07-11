import path from "node:path";

import type { ExportGenerator, ExportGeneratorOptions, Logger, PackageExport } from "@/types";

// Define proper types for export configurations
type ExportConfig =
  | string
  | {
      import?: {
        default: string;
        types?: string;
      };
      require?: {
        default: string;
        types?: string;
      };
    };

type ExportsRecord = Record<string, ExportConfig>;

/**
 * Export generator service implementation for creating package.json exports
 * Follows the Single Responsibility Principle by handling only export generation
 *
 * Moved to export-generation domain as it handles export generation logic.
 */
export class StandardExportGenerator implements ExportGenerator {
  constructor(private readonly logger: Logger) {}

  generateExports(exports: PackageExport[], options: ExportGeneratorOptions): ExportsRecord {
    this.logger.startSpinner("Generating exports configuration");

    try {
      const exportsConfig: ExportsRecord = {};

      // Sort exports to ensure consistent ordering
      const sortedExports = this.sortExports(exports, options.exportPriorities);

      for (const exp of sortedExports) {
        exportsConfig[exp.key] = this.generateSingleExport(exp, options);
      }

      // Ensure the main export "." exists, according to npm best practices
      this.ensureMainExport(exportsConfig, sortedExports, options);

      this.logger.stopSpinner(`Generated ${Object.keys(exportsConfig).length} export entries`);
      return exportsConfig;
    } catch (error) {
      this.logger.failSpinner(`Failed to generate exports: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generate exports with custom patterns
   */
  generateCustomExports(
    exports: PackageExport[],
    options: ExportGeneratorOptions,
    customMappings?: Record<string, string>,
  ): ExportsRecord {
    const baseExports = this.generateExports(exports, options);

    if (!customMappings) {
      return baseExports;
    }

    // Apply custom mappings
    const customExports: ExportsRecord = {};

    for (const [customKey, sourceKey] of Object.entries(customMappings)) {
      if (sourceKey in baseExports) {
        // eslint-disable-next-line security/detect-object-injection
        const exportValue = baseExports[sourceKey];
        if (exportValue !== undefined) {
          // eslint-disable-next-line security/detect-object-injection
          customExports[customKey] = exportValue;
        }
      } else {
        this.logger.warn(`Custom mapping source key "${sourceKey}" not found in generated exports`);
      }
    }

    return { ...baseExports, ...customExports };
  }

  /**
   * Validate generated exports configuration
   */
  validateExports(exports: Record<string, unknown>): boolean {
    try {
      // Check for the required main export
      if (!Object.prototype.hasOwnProperty.call(exports, ".")) {
        this.logger.warn('Missing main export "."');
        return false;
      }

      // Validate export structure
      for (const [key, value] of Object.entries(exports)) {
        if (!this.validateSingleExport(key, value as ExportConfig)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Export validation failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Generate exports summary for logging
   */
  generateSummary(exports: Record<string, unknown>): string {
    const totalExports = Object.keys(exports).length;
    const dualFormatCount = Object.values(exports).filter(
      exp =>
        typeof exp === "object" &&
        exp !== null &&
        (exp as Record<string, unknown>)["import"] !== undefined &&
        (exp as Record<string, unknown>)["require"] !== undefined,
    ).length;
    const simpleExports = totalExports - dualFormatCount;

    return [
      `Generated ${totalExports} exports:`,
      `  - ${dualFormatCount} dual-format (ESM + CJS)`,
      `  - ${simpleExports} simple exports`,
    ].join("\n");
  }

  private generateSingleExport(exp: PackageExport, options: ExportGeneratorOptions): ExportConfig {
    // For JSON files, return a simple path
    if (exp.sourcePath.endsWith(".json")) {
      return `./${exp.sourcePath}`;
    }

    // For dual format packages
    if (exp.dualFormat && options.dualFormat) {
      return this.generateDualFormatExport(exp, options);
    }

    // For single format packages
    return this.generateSingleFormatExport(exp, options);
  }

  private generateDualFormatExport(exp: PackageExport, options: ExportGeneratorOptions): NonNullable<ExportConfig> {
    const basePath = this.getBasePath(exp.sourcePath);

    const exportConfig: {
      import: { default: string; types?: string };
      require: { default: string; types?: string };
    } = {
      import: {
        default: this.ensureRelativePath(
          path.join(options.distDir, options.esmDir, `${basePath}${options.extensions.esm}`),
        ),
      },
      require: {
        default: this.ensureRelativePath(
          path.join(options.distDir, options.cjsDir, `${basePath}${options.extensions.cjs}`),
        ),
      },
    };

    // Add TypeScript definitions if available
    if (exp.hasTypes) {
      exportConfig.import.types = this.ensureRelativePath(
        path.join(options.distDir, options.esmDir, `${basePath}${options.extensions.types}`),
      );
      exportConfig.require.types = this.ensureRelativePath(
        path.join(options.distDir, options.cjsDir, `${basePath}${options.extensions.types}`),
      );
    }

    return exportConfig;
  }

  private generateSingleFormatExport(exp: PackageExport, options: ExportGeneratorOptions): string {
    const basePath = this.getBasePath(exp.sourcePath);
    // Always use ESM directory structure for single format exports
    const format = options.esmDir;
    const extension = options.extensions.esm;

    return this.ensureRelativePath(path.join(options.distDir, format, `${basePath}${extension}`));
  }

  private getBasePath(sourcePath: string): string {
    // Remove src/ or lib/ prefix and file extension
    let basePath = sourcePath.replace(/^(src|lib)\//, "");
    basePath = basePath.replace(/\.(ts|js)$/, "");

    return basePath;
  }

  private ensureRelativePath(path: string): string {
    // Ensure a path starts with "./" for the proper relative path format
    return path.startsWith("./") ? path : `./${path}`;
  }

  private sortExports(exports: PackageExport[], priorityConfig?: Record<string, number>): PackageExport[] {
    return exports.sort((a, b) => {
      // Main export (.) should come first
      if (a.key === ".") return -1;
      if (b.key === ".") return 1;

      // Sort by category priority
      const aPriority = this.getExportPriority(a.key, priorityConfig);
      const bPriority = this.getExportPriority(b.key, priorityConfig);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Sort alphabetically within the same category
      return a.key.localeCompare(b.key);
    });
  }

  private getExportPriority(key: string, priorityConfig?: Record<string, number>): number {
    // The main export always comes first
    if (key === ".") return 0;

    // Use custom priority configuration if provided
    if (priorityConfig) {
      for (const [pattern, priority] of Object.entries(priorityConfig)) {
        if (key.startsWith(pattern)) {
          return priority;
        }
      }
    }

    // Default priority for everything else
    return 99;
  }

  /**
   * Ensure a main export "." exists according to npm best practices
   */
  private ensureMainExport(
    exportsConfig: ExportsRecord,
    _sortedExports: PackageExport[],
    _options: ExportGeneratorOptions,
  ): void {
    // If the main export already exists, nothing to do
    if (Object.prototype.hasOwnProperty.call(exportsConfig, ".")) {
      return;
    }

    // Try to find a suitable candidate for the main export
    const mainCandidates = ["./index", "./main", "./base", "./src/index", "./lib/index"];

    for (const candidate of mainCandidates) {
      if (Object.prototype.hasOwnProperty.call(exportsConfig, candidate)) {
        // eslint-disable-next-line security/detect-object-injection
        const candidateExport = exportsConfig[candidate];
        if (candidateExport !== undefined) {
          exportsConfig["."] = candidateExport;
          this.logger.info(`Created main export "." pointing to "${candidate}"`);
          return;
        }
      }
    }

    // If no suitable candidate found, try to create the main export from the first available export
    // This is especially useful for configuration packages
    const availableExports = Object.keys(exportsConfig);
    if (availableExports.length > 0) {
      // Look for exports that seem like they could be main exports
      const potentialMains = availableExports.filter(
        key => key.includes("base") || key.includes("index") || key.includes("main") || key.includes("default"),
      );

      if (potentialMains.length > 0) {
        const mainExport = potentialMains[0];
        if (mainExport !== undefined) {
          // eslint-disable-next-line security/detect-object-injection
          const mainExportValue = exportsConfig[mainExport];
          if (mainExportValue !== undefined) {
            exportsConfig["."] = mainExportValue;
            this.logger.info(`Created main export "." pointing to "${mainExport}"`);
            return;
          }
        }
      }

      // As a last resort, use the first export alphabetically
      const sortedExports = availableExports.sort();
      if (sortedExports.length > 0) {
        const firstExport = sortedExports[0];
        if (firstExport !== undefined) {
          // eslint-disable-next-line security/detect-object-injection
          const firstExportValue = exportsConfig[firstExport];
          if (firstExportValue !== undefined) {
            exportsConfig["."] = firstExportValue;
            this.logger.warn(`Created main export "." pointing to "${firstExport}" as fallback`);
          }
        }
      }
    }
  }

  private validateSingleExport(key: string, value: ExportConfig): boolean {
    // Simple string export (for JSON files)
    if (typeof value === "string") {
      return value.startsWith("./");
    }

    // Dual format export
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof value === "object" && value !== null) {
      const valueObject = value as Record<string, unknown>;
      const hasImport = valueObject["import"] !== undefined;
      const hasRequire = valueObject["require"] !== undefined;

      if (hasImport || hasRequire) {
        return true;
      }
    }

    this.logger.warn(`Invalid export format for key "${key}"`);
    return false;
  }
}

/**
 * Factory function to create an export generator instance
 */
export function createExportGenerator(logger: Logger): ExportGenerator {
  return new StandardExportGenerator(logger);
}

/**
 * Default export generator options
 */
export const DEFAULT_EXPORT_OPTIONS: ExportGeneratorOptions = {
  dualFormat: true,
  distDir: "./dist",
  esmDir: "esm",
  cjsDir: "cjs",
  extensions: {
    esm: ".js",
    cjs: ".cjs",
    types: ".d.ts",
  },
  // No default export priorities - let packages define their own
};
