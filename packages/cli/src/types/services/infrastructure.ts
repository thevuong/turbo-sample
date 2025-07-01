/**
 * Infrastructure service interfaces
 *
 * These interfaces define contracts for CLI infrastructure services.
 * Following Single Responsibility and Interface Segregation Principles.
 */

import type { ExportConfig, ExportsConfigFile } from "@/schemas/validation";

/**
 * Interface Segregation: Separate logging functionality
 */
export interface Logger {
  /** Log info message */
  info: (message: string) => void;
  /** Log success message */
  success: (message: string) => void;
  /** Log warning message */
  warn: (message: string) => void;
  /** Log error message */
  error: (message: string) => void;
  /** Start a spinner with a message */
  startSpinner: (message: string) => void;
  /** Stop the current spinner with a success message */
  stopSpinner: (message?: string) => void;
  /** Stop the current spinner with an error message */
  failSpinner: (message?: string) => void;
}

/**
 * Interface Segregation: Separate configuration loading functionality
 */
export interface ConfigLoader {
  /** Load exports configuration from a file */
  loadConfig: (configPath?: string) => Promise<ExportsConfigFile | null>;
  /** Find a configuration file in a project */
  findConfigFile: (startPath?: string) => Promise<string | null>;
  /** Merge global and package-specific configuration */
  mergeConfig: (global: ExportConfig | undefined, packageConfig: ExportConfig | undefined) => ExportConfig;
}

/**
 * Interface Segregation: Separate CLI command functionality
 */
export interface CLICommand<T = unknown> {
  /** Command name */
  name: string;
  /** Command description */
  description: string;
  /** Execute the command */
  execute: (args: T) => Promise<void>;
  /** Validate command options */
  validateOptions?: (args: T) => void;
}
