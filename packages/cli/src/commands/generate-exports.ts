import { readdir } from "node:fs/promises";
import path from "node:path";

import { pathExists } from "fs-extra/esm";
import { ZodError } from "zod";

import { generateExportsOptionsSchema } from "@/schemas/validation";
import { DEFAULT_EXPORT_OPTIONS } from "@/services";

import type {
  CLICommand,
  ConfigLoader,
  ExportGenerator,
  ExportGeneratorOptions,
  ExportsConfigFile,
  FileScanner,
  GenerateExportsOptions,
  Logger,
  PackageManager,
} from "@/types";

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
    private readonly configLoader: ConfigLoader,
  ) {}

  async execute(options: GenerateExportsOptions): Promise<void> {
    try {
      this.logger.info("Starting export generation...");

      // Load configuration file
      const config = await this.configLoader.loadConfig(options.config);

      const packages = await this.resolvePackages(options.package);

      for (const packagePath of packages) {
        await this.processPackage(packagePath, options, config);
      }

      this.logger.success("Export generation completed successfully!");
    } catch (error) {
      this.logger.error(`Export generation failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Validate command options using Zod
   */
  validateOptions(options: GenerateExportsOptions): void {
    try {
      // First validate with Zod schema
      generateExportsOptionsSchema.parse(options);

      // Additional custom validations
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
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map(zodError => `${zodError.path.join(".")}: ${zodError.message}`)
          .join(", ");
        throw new Error(`Invalid command options: ${errorMessages}`);
      }
      throw error;
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

    // Assume it's a package name in the packages directory
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

  private async processPackage(
    packagePath: string,
    options: GenerateExportsOptions,
    config: ExportsConfigFile | null,
  ): Promise<void> {
    try {
      // Read package information
      const packageJson = await this.packageManager.readPackageJson(packagePath);
      this.logger.info(`Processing package: ${packageJson.name}`);

      // Create a backup if requested
      if (options.backup === true && options.dryRun !== true) {
        await this.packageManager.backupPackageJson(packagePath);
      }

      // Scan for exportable files
      let detectedExports = await this.fileScanner.scanPackage(packagePath);

      // Merge CLI options with configuration
      const globalConfig = config?.global;
      const packageConfig = config?.packages?.[packageJson.name];
      const mergedConfig = this.configLoader.mergeConfig(globalConfig, packageConfig);

      // Determine finally include/exclude patterns (CLI options take precedence)
      const finalInclude = options.include ?? mergedConfig.include;
      const finalExclude = options.exclude ?? mergedConfig.exclude;

      // Apply filters if specified
      if (finalInclude || finalExclude) {
        detectedExports = this.fileScanner.filterExports(detectedExports, finalInclude, finalExclude);
      }

      if (detectedExports.length === 0) {
        this.logger.warn(`No exportable files found in ${packageJson.name}`);
        return;
      }

      // Generate export options (CLI options take precedence over config)
      const exportOptions: ExportGeneratorOptions = {
        ...DEFAULT_EXPORT_OPTIONS,
        dualFormat: options.dualFormat ?? mergedConfig.dualFormat ?? DEFAULT_EXPORT_OPTIONS.dualFormat,
        ...(mergedConfig.exportPriorities && { exportPriorities: mergedConfig.exportPriorities }),
      };

      // Determine final mappings (CLI options take precedence)
      const finalMappings = options.mappings ?? mergedConfig.mappings;

      // Generate exports configuration
      const exportsConfig = finalMappings
        ? this.exportGenerator.generateCustomExports(detectedExports, exportOptions, finalMappings)
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
  configLoader: ConfigLoader,
): CLICommand<GenerateExportsOptions> {
  return new GenerateExportsCommand(logger, fileScanner, exportGenerator, packageManager, configLoader);
}

// Export the GenerateExportsOptions type for external use
export type { GenerateExportsOptions } from "@/types";
