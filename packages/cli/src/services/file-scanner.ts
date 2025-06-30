import path from "node:path";

import { pathExists } from "fs-extra";
import { glob } from "glob";

import type { FileScanner, Logger, PackageExport } from "@/types";

/**
 * File scanner service implementation for detecting exportable files
 * Follows the Single Responsibility Principle by handling only file scanning concerns
 */
export class GlobFileScanner implements FileScanner {
  constructor(private readonly logger: Logger) {}

  async scanPackage(packagePath: string): Promise<PackageExport[]> {
    try {
      this.logger.startSpinner(`Scanning package at ${packagePath}`);

      const exports: PackageExport[] = [];

      // Scan for TypeScript/JavaScript source files
      const sourceFiles = await this.scanSourceFiles(packagePath);
      exports.push(...sourceFiles);

      // Scan for JSON configuration files
      const jsonFiles = await this.scanJsonFiles(packagePath);
      exports.push(...jsonFiles);

      this.logger.stopSpinner(`Found ${exports.length} exportable files`);
      return exports;
    } catch (error) {
      this.logger.failSpinner(`Failed to scan package: ${error}`);
      throw error;
    }
  }

  /**
   * Filter exports based on patterns
   */
  filterExports(exports: PackageExport[], includePatterns?: string[], excludePatterns?: string[]): PackageExport[] {
    let filtered = [...exports];

    if (includePatterns && includePatterns.length > 0) {
      filtered = filtered.filter(exp =>
        includePatterns.some(pattern => exp.key.includes(pattern) || exp.sourcePath.includes(pattern)),
      );
    }

    if (excludePatterns && excludePatterns.length > 0) {
      filtered = filtered.filter(
        exp => !excludePatterns.some(pattern => exp.key.includes(pattern) || exp.sourcePath.includes(pattern)),
      );
    }

    return filtered;
  }

  /**
   * Group exports by category (presets, core, utils, etc.)
   */
  groupExports(exports: PackageExport[]): Record<string, PackageExport[]> {
    const groups: Record<string, PackageExport[]> = {};

    for (const exp of exports) {
      const category = this.categorizeExport(exp);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(exp);
    }

    return groups;
  }

  private async scanSourceFiles(packagePath: string): Promise<PackageExport[]> {
    const exports: PackageExport[] = [];

    // Common patterns for source files
    const patterns = ["src/**/*.ts", "src/**/*.js", "lib/**/*.ts", "lib/**/*.js"];

    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd: packagePath,
        ignore: [
          "**/*.test.ts",
          "**/*.test.js",
          "**/*.spec.ts",
          "**/*.spec.js",
          "**/*.d.ts",
          "**/tests/**",
          "**/test/**",
          "**/__tests__/**",
          "**/node_modules/**",
          "**/dist/**",
          "**/build/**",
        ],
      });

      for (const file of files) {
        const exportKey = this.generateExportKey(file);
        const dualFormat = await this.checkDualFormatSupport(packagePath);

        exports.push({
          key: exportKey,
          sourcePath: file,
          dualFormat,
          hasTypes: path.extname(file) === ".ts",
        });
      }
    }

    return exports;
  }

  private async scanJsonFiles(packagePath: string): Promise<PackageExport[]> {
    const exports: PackageExport[] = [];

    // Scan for configuration JSON files (like TypeScript configs)
    const jsonFiles = await glob("*.json", {
      cwd: packagePath,
      ignore: [
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "jest.config.json",
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
      ],
    });

    for (const file of jsonFiles) {
      const exportKey = this.generateExportKeyFromJson(file);

      exports.push({
        key: exportKey,
        sourcePath: file,
        dualFormat: false, // JSON files don't need dual format
        hasTypes: false,
      });
    }

    return exports;
  }

  private generateExportKey(filePath: string): string {
    // Remove src/ or lib/ prefix and file extension
    let key = filePath.replace(/^(src|lib)\//, "");
    key = key.replace(/\.(ts|js)$/, "");

    // Handle index files
    if (path.basename(key) === "index") {
      const dir = path.dirname(key);
      key = dir === "." ? "." : `./${dir}`;
    } else {
      key = `./${key}`;
    }

    return key;
  }

  private generateExportKeyFromJson(filePath: string): string {
    const name = path.basename(filePath, ".json");
    return `./${name}`;
  }

  private async checkDualFormatSupport(packagePath: string): Promise<boolean> {
    // Check if package has build configuration that supports dual format
    const buildConfigs = [
      "rslib.config.ts",
      "rslib.config.js",
      "rollup.config.ts",
      "rollup.config.js",
      "webpack.config.ts",
      "webpack.config.js",
    ];

    for (const config of buildConfigs) {
      if (await pathExists(path.join(packagePath, config))) {
        return true;
      }
    }

    return false;
  }

  private categorizeExport(exp: PackageExport): string {
    const path = exp.sourcePath.toLowerCase();

    if (Boolean(path.includes("preset"))) return "presets";
    if (Boolean(path.includes("core"))) return "core";
    if (Boolean(path.includes("util"))) return "utils";
    if (Boolean(path.includes("framework"))) return "frameworks";
    if (Boolean(path.includes("environment"))) return "environments";
    if (Boolean(path.includes("language"))) return "languages";
    if (Boolean(path.includes("test"))) return "testing";

    return "misc";
  }
}

/**
 * Factory function to create a file scanner instance
 */
export function createFileScanner(logger: Logger): FileScanner {
  return new GlobFileScanner(logger);
}
