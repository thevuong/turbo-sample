import path from "node:path";

import { pathExists } from "fs-extra/esm";
import { ZodError } from "zod";

import { exportsConfigFileSchema } from "@/schemas/validation";

import type { ConfigLoader, ExportConfig, ExportsConfigFile, Logger } from "@/types";

/**
 * Configuration loader for exports.config.{js,ts} files
 * Supports both JavaScript and TypeScript configuration files
 */
export class StandardConfigLoader implements ConfigLoader {
  private readonly configFileNames = [
    "exports.config.ts",
    "exports.config.js",
    "exports.config.mjs",
    "exports.config.cjs",
  ];

  constructor(private readonly logger: Logger) {}

  async findConfigFile(startPath = process.cwd()): Promise<string | null> {
    for (const fileName of this.configFileNames) {
      const configPath = path.join(startPath, fileName);
      if (await pathExists(configPath)) {
        return configPath;
      }
    }
    return null;
  }

  async loadConfig(configPath?: string): Promise<ExportsConfigFile | null> {
    try {
      let resolvedPath: string | null;

      if (configPath) {
        // Use provided path
        if (!(await pathExists(configPath))) {
          this.logger.warn(`Configuration file not found: ${configPath}`);
          return null;
        }
        resolvedPath = configPath;
      } else {
        // Find configuration file
        resolvedPath = await this.findConfigFile();
        if (!resolvedPath) {
          this.logger.info("No exports configuration file found, using defaults");
          return null;
        }
      }

      this.logger.info(`Loading exports configuration from: ${resolvedPath}`);

      // Dynamic import to support both JS and TS files
      const configModule = await import(resolvedPath);
      const config = configModule.default ?? configModule;

      // Validate configuration structure using Zod
      try {
        return exportsConfigFileSchema.parse(config);
      } catch (error) {
        if (error instanceof ZodError) {
          this.logger.warn(
            `Invalid configuration structure: ${error.errors.map(zodError => `${zodError.path.join(".")}: ${zodError.message}`).join(", ")}`,
          );
        } else {
          this.logger.warn("Invalid configuration structure, using defaults");
        }
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  mergeConfig(global: ExportConfig | undefined, packageConfig: ExportConfig | undefined): ExportConfig {
    const merged: ExportConfig = {};

    // Start with global config
    if (global) {
      Object.assign(merged, global);
    }

    // Override with a package-specific config
    if (packageConfig) {
      // Merge arrays for include/exclude patterns
      if (packageConfig.include) {
        merged.include = [...(merged.include ?? []), ...packageConfig.include];
      }
      if (packageConfig.exclude) {
        merged.exclude = [...(merged.exclude ?? []), ...packageConfig.exclude];
      }

      // Override other properties
      if (packageConfig.mappings) {
        merged.mappings = { ...merged.mappings, ...packageConfig.mappings };
      }
      if (packageConfig.dualFormat !== undefined) {
        merged.dualFormat = packageConfig.dualFormat;
      }
      if (packageConfig.exportPriorities) {
        merged.exportPriorities = { ...merged.exportPriorities, ...packageConfig.exportPriorities };
      }
    }

    return merged;
  }
}

/**
 * Factory function to create a configuration loader
 */
export function createConfigLoader(logger: Logger): ConfigLoader {
  return new StandardConfigLoader(logger);
}
