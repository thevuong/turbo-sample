import { join } from "node:path";

import type { ExportGenerator, ExportGeneratorOptions, Logger, PackageExport } from "@/types/index.js";

/**
 * Export generator service implementation for creating package.json exports
 * Follows the Single Responsibility Principle by handling only export generation
 */
export class StandardExportGenerator implements ExportGenerator {
  constructor(private readonly logger: Logger) {}

  generateExports(exports: PackageExport[], options: ExportGeneratorOptions): Record<string, any> {
    this.logger.startSpinner("Generating exports configuration");

    try {
      const exportsConfig: Record<string, any> = {};

      // Sort exports to ensure consistent ordering
      const sortedExports = this.sortExports(exports);

      for (const exp of sortedExports) {
        const exportConfig = this.generateSingleExport(exp, options);
        exportsConfig[exp.key] = exportConfig;
      }

      this.logger.stopSpinner(`Generated ${Object.keys(exportsConfig).length} export entries`);
      return exportsConfig;
    } catch (error) {
      this.logger.failSpinner(`Failed to generate exports: ${error}`);
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
  ): Record<string, any> {
    const baseExports = this.generateExports(exports, options);

    if (!customMappings) {
      return baseExports;
    }

    // Apply custom mappings
    const customExports: Record<string, any> = {};

    for (const [customKey, sourceKey] of Object.entries(customMappings)) {
      if (baseExports[sourceKey]) {
        customExports[customKey] = baseExports[sourceKey];
      } else {
        this.logger.warn(`Custom mapping source key "${sourceKey}" not found in generated exports`);
      }
    }

    return { ...baseExports, ...customExports };
  }

  /**
   * Validate generated exports configuration
   */
  validateExports(exports: Record<string, any>): boolean {
    try {
      // Check for required main export
      if (!exports["."]) {
        this.logger.warn('Missing main export "."');
        return false;
      }

      // Validate export structure
      for (const [key, value] of Object.entries(exports)) {
        if (!this.validateSingleExport(key, value)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Export validation failed: ${error}`);
      return false;
    }
  }

  /**
   * Generate exports summary for logging
   */
  generateSummary(exports: Record<string, any>): string {
    const totalExports = Object.keys(exports).length;
    const dualFormatCount = Object.values(exports).filter(
      exp => typeof exp === "object" && exp.import && exp.require,
    ).length;
    const simpleExports = totalExports - dualFormatCount;

    return [
      `Generated ${totalExports} exports:`,
      `  - ${dualFormatCount} dual-format (ESM + CJS)`,
      `  - ${simpleExports} simple exports`,
    ].join("\n");
  }

  private generateSingleExport(exp: PackageExport, options: ExportGeneratorOptions): any {
    // For JSON files, return simple path
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

  private generateDualFormatExport(exp: PackageExport, options: ExportGeneratorOptions): any {
    const basePath = this.getBasePath(exp.sourcePath);

    const exportConfig: any = {
      import: {
        default: join(options.distDir, options.esmDir, `${basePath}${options.extensions.esm}`),
      },
      require: {
        default: join(options.distDir, options.cjsDir, `${basePath}${options.extensions.cjs}`),
      },
    };

    // Add TypeScript definitions if available
    if (exp.hasTypes) {
      exportConfig.import.types = join(options.distDir, options.esmDir, `${basePath}${options.extensions.types}`);
      exportConfig.require.types = join(options.distDir, options.cjsDir, `${basePath}${options.extensions.types}`);
    }

    return exportConfig;
  }

  private generateSingleFormatExport(exp: PackageExport, options: ExportGeneratorOptions): string {
    const basePath = this.getBasePath(exp.sourcePath);
    const format = options.dualFormat ? options.esmDir : "dist";
    const extension = options.dualFormat ? options.extensions.esm : ".js";

    return join(options.distDir, format, `${basePath}${extension}`);
  }

  private getBasePath(sourcePath: string): string {
    // Remove src/ or lib/ prefix and file extension
    let basePath = sourcePath.replace(/^(src|lib)\//, "");
    basePath = basePath.replace(/\.(ts|js)$/, "");

    return basePath;
  }

  private sortExports(exports: PackageExport[]): PackageExport[] {
    return exports.sort((a, b) => {
      // Main export (.) should come first
      if (a.key === ".") return -1;
      if (b.key === ".") return 1;

      // Sort by category priority
      const aPriority = this.getExportPriority(a.key);
      const bPriority = this.getExportPriority(b.key);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Sort alphabetically within same category
      return a.key.localeCompare(b.key);
    });
  }

  private getExportPriority(key: string): number {
    // Define priority order for different export categories
    if (key === ".") return 0;
    if (key.startsWith("./base")) return 1;
    if (key.startsWith("./react")) return 2;
    if (key.startsWith("./next")) return 3;
    if (key.startsWith("./library")) return 4;
    if (key.startsWith("./presets/")) return 5;
    if (key.startsWith("./core/")) return 6;
    if (key.startsWith("./environments/")) return 7;
    if (key.startsWith("./languages/")) return 8;
    if (key.startsWith("./frameworks/")) return 9;
    if (key.startsWith("./utils/")) return 10;
    if (key.startsWith("./testing/")) return 11;

    return 99; // Everything else
  }

  private validateSingleExport(key: string, value: any): boolean {
    // Simple string export (for JSON files)
    if (typeof value === "string") {
      return value.startsWith("./");
    }

    // Dual format export
    if (typeof value === "object" && value !== null) {
      const hasImport = value.import && typeof value.import === "object";
      const hasRequire = value.require && typeof value.require === "object";

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
};
