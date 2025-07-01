/**
 * Infrastructure-related types and interfaces for CLI, logging, and configuration
 */

import type { ExportConfig, ExportsConfigFile } from "@/schemas/validation";

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

export interface ConfigLoader {
  /** Load exports configuration from a file */
  loadConfig: (configPath?: string) => Promise<ExportsConfigFile | null>;
  /** Find a configuration file in a project */
  findConfigFile: (startPath?: string) => Promise<string | null>;
  /** Merge global and package-specific configuration */
  mergeConfig: (global: ExportConfig | undefined, packageConfig: ExportConfig | undefined) => ExportConfig;
}

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
