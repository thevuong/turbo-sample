import path from "node:path";

import { pathExists, readJson, writeJson } from "fs-extra/esm";
import { ZodError } from "zod";

import { packageJsonSchema } from "@/schemas/validation";

import type { Logger, PackageJson, PackageManager } from "@/types";

/**
 * Package manager service implementation for handling package.json operations
 * Follows the Single Responsibility Principle by handling only package.json concerns
 */
export class FileSystemPackageManager implements PackageManager {
  constructor(private readonly logger: Logger) {}

  async readPackageJson(packagePath: string): Promise<PackageJson> {
    const packageJsonPath = path.join(packagePath, "package.json");

    if (!(await pathExists(packageJsonPath))) {
      throw new Error(`package.json not found at ${packageJsonPath}`);
    }

    try {
      const packageJson = await readJson(packageJsonPath);

      // Validate package.json structure using Zod
      try {
        const validatedPackageJson = packageJsonSchema.parse(packageJson);
        return validatedPackageJson;
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMessages = validationError.errors
            .map(zodError => `${zodError.path.join(".")}: ${zodError.message}`)
            .join(", ");
          throw new TypeError(`Invalid package.json at ${packageJsonPath}: ${errorMessages}`);
        }
        throw new TypeError(`Invalid package.json at ${packageJsonPath}: validation failed`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to read package.json at ${packageJsonPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async updatePackageJson(packagePath: string, exports: Record<string, unknown>): Promise<void> {
    const packageJsonPath = path.join(packagePath, "package.json");

    try {
      // Read current package.json
      const packageJson = await this.readPackageJson(packagePath);

      // Update exports while preserving other fields
      const updatedPackageJson = {
        ...packageJson,
        exports,
      };

      // Write back to file with proper formatting
      await writeJson(packageJsonPath, updatedPackageJson, {
        spaces: 2,
        EOL: "\n",
      });

      this.logger.success(`Updated exports in ${packageJson.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to update package.json at ${packageJsonPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Backup package.json before making changes
   */
  async backupPackageJson(packagePath: string): Promise<string> {
    const packageJsonPath = path.join(packagePath, "package.json");
    const backupPath = path.join(packagePath, `package.json.backup.${Date.now()}`);

    try {
      const packageJson = await readJson(packageJsonPath);
      await writeJson(backupPath, packageJson, { spaces: 2 });

      this.logger.info(`Created backup at ${backupPath}`);
      return backupPath;
    } catch (error) {
      this.logger.error(`Failed to create backup: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

/**
 * Factory function to create a package manager instance
 * Follows the Dependency Inversion Principle by accepting dependencies
 */
export function createPackageManager(logger: Logger): PackageManager {
  return new FileSystemPackageManager(logger);
}
