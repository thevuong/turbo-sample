/**
 * Enhanced File Scanner with AST capabilities
 *
 * This service extends the existing file scanning functionality with AST analysis
 * capabilities, providing both fast glob-based scanning and accurate AST-based analysis.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles file scanning and analysis
 * - Open/Closed: Can be extended with new analysis modes
 * - Liskov Substitution: Can replace the original FileScanner
 * - Interface Segregation: Implements focused interfaces
 * - Dependency Inversion: Depends on abstractions
 */

import { access, constants } from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";

import { ExportKind } from "@/types";

import type {
  ASTAnalyzer,
  CategoryConfig,
  ExportInfo,
  FileAnalysis,
  FileScanner,
  Logger,
  PackageExport,
  ReExportInfo,
  TypeExportInfo,
} from "@/types";

export interface EnhancedFileScannerOptions {
  /** Whether to use AST analysis for more accurate results */
  useASTAnalysis?: boolean;
  /** Whether to fall back to glob scanning if AST analysis fails */
  fallbackToGlob?: boolean;
  /** Whether to cache AST analysis results */
  enableCaching?: boolean;
  /** Custom patterns for glob scanning */
  customPatterns?: string[];
  /** Custom ignore patterns */
  customIgnorePatterns?: string[];
}

/**
 * Enhanced File Scanner that combines glob-based and AST-based scanning
 *
 * Provides two modes:
 * 1. Fast mode: Uses glob patterns (compatible with existing behavior)
 * 2. Accurate mode: Uses AST analysis for precise export detection
 */
export class EnhancedFileScanner implements FileScanner {
  private categoryConfig?: CategoryConfig;
  private readonly analysisCache = new Map<string, FileAnalysis>();

  constructor(
    private readonly logger: Logger,
    private readonly astAnalyzer?: ASTAnalyzer,
    private readonly options: EnhancedFileScannerOptions = {},
  ) {
    // Set default options
    this.options = {
      useASTAnalysis: false, // Default to fast mode for backward compatibility
      fallbackToGlob: true,
      enableCaching: true,
      ...options,
    };
  }

  setCategoryConfig(config: CategoryConfig): void {
    this.categoryConfig = config;
  }

  async scanPackage(packagePath: string): Promise<PackageExport[]> {
    try {
      this.logger.info(`Scanning package: ${packagePath} (AST: ${this.options.useASTAnalysis})`);

      return await (this.options.useASTAnalysis && this.astAnalyzer
        ? this.scanWithAST(packagePath)
        : this.scanWithGlob(packagePath));
    } catch (error) {
      this.logger.error(`Failed to scan package ${packagePath}: ${String(error)}`);

      // Fallback to glob scanning if AST analysis fails
      if (this.options.useASTAnalysis && this.options.fallbackToGlob) {
        this.logger.warn("Falling back to glob-based scanning");
        return await this.scanWithGlob(packagePath);
      }

      throw error;
    }
  }

  filterExports(exports: PackageExport[], includePatterns?: string[], excludePatterns?: string[]): PackageExport[] {
    let filtered = exports;

    // Apply include patterns
    if (includePatterns && includePatterns.length > 0) {
      filtered = filtered.filter(exp => includePatterns.some(pattern => this.matchesPattern(exp.key, pattern)));
    }

    // Apply exclude patterns
    if (excludePatterns && excludePatterns.length > 0) {
      filtered = filtered.filter(exp => !excludePatterns.some(pattern => this.matchesPattern(exp.key, pattern)));
    }

    return filtered;
  }

  /**
   * Scan package using AST analysis for accurate export detection
   */
  private async scanWithAST(packagePath: string): Promise<PackageExport[]> {
    if (!this.astAnalyzer) {
      throw new Error("AST analyzer not available");
    }

    this.logger.startSpinner("Analyzing package with AST...");

    try {
      // Analyze the entire project
      const projectAnalysis = await this.astAnalyzer.analyzeProject(packagePath);
      const exports: PackageExport[] = [];

      // Convert AST analysis results to PackageExport format
      for (const [filePath, fileAnalysis] of projectAnalysis.files.entries()) {
        if (!fileAnalysis.hasExports) continue;

        // Skip files outside the package source directories
        const relativePath = path.relative(packagePath, filePath);
        if (!this.isSourceFile(relativePath)) continue;

        // Check if this is an index file
        const isIndexFile =
          path.basename(relativePath, path.extname(relativePath)) === "index" && path.dirname(relativePath) === "src";

        if (isIndexFile) {
          // For index files, create a single export with key "."
          const exportKey = ".";
          const dualFormat = this.checkDualFormatFromAnalysis(fileAnalysis);

          exports.push({
            key: exportKey,
            sourcePath: relativePath,
            dualFormat,
            hasTypes:
              fileAnalysis.isDeclarationFile ||
              fileAnalysis.typeExports.length > 0 ||
              fileAnalysis.exports.some(exp => exp.isTypeOnly),
            metadata: {
              isIndexFile: true,
              exportCount:
                fileAnalysis.exports.length + fileAnalysis.reExports.length + fileAnalysis.typeExports.length,
              isAnalyzed: true,
            },
          });
        } else {
          // For non-index files, convert each export to PackageExport
          for (const exportInfo of fileAnalysis.exports) {
            const packageExport = this.convertExportInfoToPackageExport(exportInfo, fileAnalysis, packagePath);
            if (packageExport) {
              exports.push(packageExport);
            }
          }

          // Handle re-exports
          for (const reExportInfo of fileAnalysis.reExports) {
            const packageExport = this.convertReExportToPackageExport(reExportInfo, fileAnalysis, packagePath);
            if (packageExport) {
              exports.push(packageExport);
            }
          }

          // Handle type exports
          for (const typeExportInfo of fileAnalysis.typeExports) {
            const packageExport = this.convertTypeExportToPackageExport(typeExportInfo, fileAnalysis, packagePath);
            if (packageExport) {
              exports.push(packageExport);
            }
          }
        }
      }

      // Cache the analysis results
      if (this.options.enableCaching) {
        for (const [filePath, analysis] of projectAnalysis.files.entries()) {
          this.analysisCache.set(filePath, analysis);
        }
      }

      this.logger.stopSpinner(`AST analysis complete: ${exports.length} exports found`);
      return this.groupExports(exports);
    } catch (error) {
      this.logger.failSpinner(`AST analysis failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Scan package using glob patterns (original implementation)
   */
  private async scanWithGlob(packagePath: string): Promise<PackageExport[]> {
    this.logger.info("Scanning package with glob patterns...");

    const exports: PackageExport[] = [];

    // Scan source files
    const sourceExports = await this.scanSourceFiles(packagePath);
    exports.push(...sourceExports);

    // Scan JSON files
    const jsonExports = await this.scanJsonFiles(packagePath);
    exports.push(...jsonExports);

    return this.groupExports(exports);
  }

  private async scanSourceFiles(packagePath: string): Promise<PackageExport[]> {
    const exports: PackageExport[] = [];

    // Use custom patterns if provided, otherwise use default patterns
    const patterns = this.options.customPatterns ?? ["src/**/*.ts", "src/**/*.js", "lib/**/*.ts", "lib/**/*.js"];

    const ignorePatterns = [
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
      ...(this.options.customIgnorePatterns ?? []),
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd: packagePath,
        ignore: ignorePatterns,
      });

      for (const file of files) {
        const exportKey = this.generateExportKey(file);
        const dualFormat = await this.checkDualFormatSupport(packagePath);

        // If AST analyzer is available and caching is enabled, try to get more accurate info
        let hasTypes = path.extname(file) === ".ts";
        let exportCount = 1; // Default assumption

        if (this.astAnalyzer && this.options.enableCaching) {
          const absolutePath = path.resolve(packagePath, file);
          const cachedAnalysis = this.analysisCache.get(absolutePath);

          if (cachedAnalysis) {
            hasTypes =
              cachedAnalysis.isDeclarationFile ||
              cachedAnalysis.typeExports.length > 0 ||
              cachedAnalysis.exports.some(exp => exp.isTypeOnly);
            exportCount =
              cachedAnalysis.exports.length + cachedAnalysis.reExports.length + cachedAnalysis.typeExports.length;
          }
        }

        exports.push({
          key: exportKey,
          sourcePath: file,
          dualFormat,
          hasTypes,
          // Add metadata from AST analysis if available
          metadata: {
            exportCount,
            isAnalyzed: this.analysisCache.has(path.resolve(packagePath, file)),
          },
        });
      }
    }

    return exports;
  }

  private async scanJsonFiles(packagePath: string): Promise<PackageExport[]> {
    const exports: PackageExport[] = [];

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
        dualFormat: false,
        hasTypes: false,
      });
    }

    return exports;
  }

  private convertExportInfoToPackageExport(
    exportInfo: ExportInfo,
    fileAnalysis: FileAnalysis,
    packagePath: string,
  ): PackageExport | null {
    const relativePath = path.relative(packagePath, fileAnalysis.filePath);

    if (!this.isSourceFile(relativePath)) return null;

    const exportKey = this.generateExportKeyFromAST(exportInfo, relativePath);
    const dualFormat = this.checkDualFormatFromAnalysis(fileAnalysis);

    return {
      key: exportKey,
      sourcePath: relativePath,
      dualFormat,
      hasTypes: exportInfo.isTypeOnly || fileAnalysis.isDeclarationFile,
      metadata: {
        exportName: exportInfo.name,
        exportKind: exportInfo.kind,
        isDefault: exportInfo.isDefault,
        isTypeOnly: exportInfo.isTypeOnly,
        documentation: exportInfo.documentation,
        location: exportInfo.location,
        isAnalyzed: true,
      },
    };
  }

  private convertReExportToPackageExport(
    reExportInfo: ReExportInfo,
    fileAnalysis: FileAnalysis,
    packagePath: string,
  ): PackageExport | null {
    const relativePath = path.relative(packagePath, fileAnalysis.filePath);

    if (!this.isSourceFile(relativePath)) return null;

    // For re-exports, we create a special export key
    const exportKey = this.generateReExportKey(reExportInfo, relativePath);
    const dualFormat = this.checkDualFormatFromAnalysis(fileAnalysis);

    return {
      key: exportKey,
      sourcePath: relativePath,
      dualFormat,
      hasTypes: reExportInfo.isTypeOnly,
      metadata: {
        isReExport: true,
        moduleSpecifier: reExportInfo.moduleSpecifier,
        exports: reExportInfo.exports,
        isNamespaceReExport: reExportInfo.isNamespaceReExport,
        isTypeOnly: reExportInfo.isTypeOnly,
        isAnalyzed: true,
      },
    };
  }

  private convertTypeExportToPackageExport(
    typeExportInfo: TypeExportInfo,
    fileAnalysis: FileAnalysis,
    packagePath: string,
  ): PackageExport | null {
    const relativePath = path.relative(packagePath, fileAnalysis.filePath);

    if (!this.isSourceFile(relativePath)) return null;

    const exportKey = this.generateExportKeyFromAST(typeExportInfo, relativePath);
    const dualFormat = this.checkDualFormatFromAnalysis(fileAnalysis);

    return {
      key: exportKey,
      sourcePath: relativePath,
      dualFormat,
      hasTypes: true,
      metadata: {
        exportName: typeExportInfo.name,
        exportKind: typeExportInfo.kind,
        isDefault: typeExportInfo.isDefault,
        isTypeOnly: true,
        documentation: typeExportInfo.documentation,
        typeDefinition: typeExportInfo.typeDefinition,
        isAnalyzed: true,
      },
    };
  }

  private generateExportKey(filePath: string): string {
    // Remove src/ or lib/ prefix and file extension
    let key = filePath.replace(/^(src|lib)\//, "");
    key = key.replace(/\.(ts|js)$/, "");

    // Handle index files
    if (path.basename(key) === "index") {
      const directory = path.dirname(key);
      key = directory === "." ? "." : `./${directory}`;
    } else {
      key = `./${key}`;
    }

    return key;
  }

  private generateExportKeyFromJson(filePath: string): string {
    const name = path.basename(filePath, ".json");
    return `./${name}`;
  }

  private generateExportKeyFromAST(exportInfo: ExportInfo | TypeExportInfo, relativePath: string): string {
    // For default exports, use the file path
    if (exportInfo.isDefault) {
      return this.generateExportKey(relativePath);
    }

    // For named exports, include the export name
    const baseKey = this.generateExportKey(relativePath);
    if (baseKey === ".") {
      return `./${exportInfo.name}`;
    }

    return `${baseKey}/${exportInfo.name}`;
  }

  private generateReExportKey(reExportInfo: ReExportInfo, relativePath: string): string {
    const baseKey = this.generateExportKey(relativePath);

    if (reExportInfo.isNamespaceReExport) {
      return `${baseKey}/*`;
    }

    if (reExportInfo.exports.length === 1) {
      return `${baseKey}/${reExportInfo.exports[0]}`;
    }

    return `${baseKey}/{${reExportInfo.exports.join(",")}}`;
  }

  private async checkDualFormatSupport(packagePath: string): Promise<boolean> {
    const buildConfigs = [
      "rslib.config.ts",
      "rslib.config.js",
      "rollup.config.ts",
      "rollup.config.js",
      "webpack.config.ts",
      "webpack.config.js",
    ];

    for (const config of buildConfigs) {
      try {
        await access(path.join(packagePath, config), constants.F_OK);
        return true;
      } catch {
        // File doesn't exist, continue to next config
      }
    }

    return false;
  }

  private checkDualFormatFromAnalysis(fileAnalysis: FileAnalysis): boolean {
    // Check if the file analysis indicates dual-format support
    // This could be determined by build configuration or package.json analysis
    return fileAnalysis.filePath.includes("src/") || fileAnalysis.filePath.includes("lib/");
  }

  private isSourceFile(relativePath: string): boolean {
    return (
      relativePath.startsWith("src/") ||
      relativePath.startsWith("lib/") ||
      (!relativePath.includes("node_modules") && !relativePath.includes("dist") && !relativePath.includes("build"))
    );
  }

  private matchesPattern(text: string, pattern: string): boolean {
    // Simple pattern matching - could be enhanced with more sophisticated matching
    const regex = new RegExp(pattern.replaceAll("*", ".*"));
    return regex.test(text);
  }

  private groupExports(exports: PackageExport[]): PackageExport[] {
    if (!this.categoryConfig) {
      return exports;
    }

    // Group exports by category if category config is provided
    const groups: Record<string, PackageExport[]> = {};

    for (const exp of exports) {
      const category = this.categorizeExport(exp);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(exp);
    }

    // Flatten the groups back to a single array
    // The grouping is mainly for internal organization
    return exports;
  }

  private categorizeExport(exp: PackageExport): string {
    if (!this.categoryConfig) {
      return "default";
    }

    // Use metadata if available from AST analysis
    if (exp.metadata?.["exportKind"]) {
      const kind = exp.metadata["exportKind"] as ExportKind;

      switch (kind) {
        case ExportKind.Function: {
          return "functions";
        }
        case ExportKind.Class: {
          return "classes";
        }
        case ExportKind.Interface:
        case ExportKind.Type: {
          return "types";
        }
        case ExportKind.Const:
        case ExportKind.Let:
        case ExportKind.Variable: {
          return "constants";
        }
        default: {
          return "default";
        }
      }
    }

    // Fallback to path-based categorization
    if (exp.sourcePath.includes("types/")) return "types";
    if (exp.sourcePath.includes("utils/")) return "utils";
    if (exp.sourcePath.includes("components/")) return "components";

    return "default";
  }
}

/**
 * Factory function to create an Enhanced File Scanner
 * Follows Dependency Inversion Principle
 */
export function createEnhancedFileScanner(
  logger: Logger,
  astAnalyzer?: ASTAnalyzer,
  options?: EnhancedFileScannerOptions,
): FileScanner {
  return new EnhancedFileScanner(logger, astAnalyzer, options);
}
