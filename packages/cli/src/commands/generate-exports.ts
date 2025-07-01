import path from "node:path";

import { pathExists } from "fs-extra";

import { DEFAULT_EXPORT_OPTIONS } from "@/services/export-generator";

import type { CLICommand, ExportGenerator, ExportGeneratorOptions, FileScanner, Logger, PackageManager } from "@/types";

export interface GenerateExportsOptions {
  /** Target package path or name */
  package?: string;
  /** Whether to generate dual format exports */
  dualFormat?: boolean;
  /** Dry run mode - don't write files */
  dryRun?: boolean;
  /** Create backup before updating */
  backup?: boolean;
  /** Include patterns for files */
  include?: string[];
  /** Exclude patterns for files */
  exclude?: string[];
  /** Custom export mappings */
  mappings?: Record<string, string> | undefined;
}

/**
 * Command to generate exports for packages
 * Follows the Command pattern and Single Responsibility Principle
 */
export class GenerateExportsCommand implements CLICommand<GenerateExportsOptions> {
  name = "generate-exports";
  description = "Generate package.json exports for packages based on source files";

  constructor(
    private readonly logger: Logger,
    private readonly fileScanner: FileScanner,
    private readonly exportGenerator: ExportGenerator,
    private readonly packageManager: PackageManager,
  ) {}

  async execute(options: GenerateExportsOptions): Promise<void> {
    try {
      this.logger.info("Starting export generation...");

      const packages = await this.resolvePackages(options.package);

      for (const packagePath of packages) {
        await this.processPackage(packagePath, options);
      }

      this.logger.success("Export generation completed successfully!");
    } catch (error) {
      this.logger.error(`Export generation failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Validate command options
   */
  validateOptions(options: GenerateExportsOptions): void {
    if (options.include && options.include.length === 0) {
      throw new Error("Include patterns cannot be empty array");
    }

    if (options.exclude && options.exclude.length === 0) {
      throw new Error("Exclude patterns cannot be empty array");
    }

    if (options.mappings) {
      for (const [key, value] of Object.entries(options.mappings)) {
        if (!key.startsWith("./")) {
          throw new Error(`Custom mapping key "${key}" must start with "./"`);
        }
        if (!value.startsWith("./")) {
          throw new Error(`Custom mapping value "${value}" must start with "./"`);
        }
      }
    }
  }

  private async resolvePackages(packageInput?: string): Promise<string[]> {
    if (typeof packageInput === "string" && packageInput.length > 0) {
      // Single package specified
      const packagePath = await this.resolvePackagePath(packageInput);
      return [packagePath];
    }

    // Auto-discover packages in monorepo
    return this.discoverPackages();
  }

  private async resolvePackagePath(packageInput: string): Promise<string> {
    // Check if it's an absolute path
    if (packageInput.startsWith("/")) {
      if (await pathExists(packageInput)) {
        return packageInput;
      }
      throw new Error(`Package path not found: ${packageInput}`);
    }

    // Check if it's a relative path
    if (packageInput.startsWith("./") || packageInput.startsWith("../")) {
      const resolvedPath = path.resolve(process.cwd(), packageInput);
      if (await pathExists(resolvedPath)) {
        return resolvedPath;
      }
      throw new Error(`Package path not found: ${resolvedPath}`);
    }

    // Assume it's a package name in packages directory
    const packagesDirectory = path.join(process.cwd(), "packages");
    const packagePath = path.join(packagesDirectory, packageInput);

    if (await pathExists(packagePath)) {
      return packagePath;
    }

    throw new Error(`Package not found: ${packageInput}. Tried: ${packagePath}`);
  }

  private async discoverPackages(): Promise<string[]> {
    this.logger.startSpinner("Discovering packages...");

    const packagesDirectory = path.join(process.cwd(), "packages");

    if (!(await pathExists(packagesDirectory))) {
      this.logger.failSpinner("No packages directory found");
      throw new Error("No packages directory found. Run this command from the monorepo root.");
    }

    const { readdir } = await import("fs-extra");
    const entries = await readdir(packagesDirectory, { withFileTypes: true });

    const packages: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const packagePath = path.join(packagesDirectory, entry.name);
        const packageJsonPath = path.join(packagePath, "package.json");

        if (await pathExists(packageJsonPath)) {
          packages.push(packagePath);
        }
      }
    }

    this.logger.stopSpinner(`Found ${packages.length} packages`);
    return packages;
  }

  private async processPackage(packagePath: string, options: GenerateExportsOptions): Promise<void> {
    try {
      // Read package info
      const packageJson = await this.packageManager.readPackageJson(packagePath);
      this.logger.info(`Processing package: ${packageJson.name}`);

      // Create backup if requested
      if (options.backup === true && options.dryRun !== true) {
        await this.packageManager.backupPackageJson(packagePath);
      }

      // Scan for exportable files
      let detectedExports = await this.fileScanner.scanPackage(packagePath);

      // Apply filters if specified
      if (options.include || options.exclude) {
        detectedExports = this.fileScanner.filterExports(detectedExports, options.include, options.exclude);
      }

      if (detectedExports.length === 0) {
        this.logger.warn(`No exportable files found in ${packageJson.name}`);
        return;
      }

      // Generate export options
      const exportOptions: ExportGeneratorOptions = {
        ...DEFAULT_EXPORT_OPTIONS,
        dualFormat: options.dualFormat ?? DEFAULT_EXPORT_OPTIONS.dualFormat,
      };

      // Generate exports configuration
      const exportsConfig = options.mappings
        ? this.exportGenerator.generateCustomExports(detectedExports, exportOptions, options.mappings)
        : this.exportGenerator.generateExports(detectedExports, exportOptions);

      // Validate generated exports
      if (!this.exportGenerator.validateExports(exportsConfig)) {
        throw new Error(`Generated exports validation failed for ${packageJson.name}`);
      }

      // Log summary
      const summary = this.exportGenerator.generateSummary(exportsConfig);
      this.logger.info(summary);

      // Update package.json (unless dry run)
      if (options.dryRun === true) {
        this.logger.info("Dry run mode - package.json not updated");
        this.logger.info("Generated exports:");
        // eslint-disable-next-line no-console -- CLI output for dry run mode
        console.log(JSON.stringify(exportsConfig, null, 2));
      } else {
        await this.packageManager.updatePackageJson(packagePath, exportsConfig);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process package at ${packagePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}

/**
 * Factory function to create the generate exports command
 */
export function createGenerateExportsCommand(
  logger: Logger,
  fileScanner: FileScanner,
  exportGenerator: ExportGenerator,
  packageManager: PackageManager,
): CLICommand<GenerateExportsOptions> {
  return new GenerateExportsCommand(logger, fileScanner, exportGenerator, packageManager);
}
