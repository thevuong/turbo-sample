/**
 * Services index - Re-exports all services for backward compatibility
 *
 * This file maintains backward compatibility while the services are now organized
 * by domain following Single Responsibility Principle and better SOLID architecture.
 */

// Re-export infrastructure services
export { createLogger, ConsoleLogger } from "./infrastructure/logger";

// Re-export configuration services
export { createConfigLoader, StandardConfigLoader } from "./configuration/config-loader";

// Re-export package management services
export { createPackageManager, FileSystemPackageManager } from "./package-management/package-manager";

// Re-export export generation services
export {
  createExportGenerator,
  StandardExportGenerator,
  DEFAULT_EXPORT_OPTIONS,
} from "./export-generation/export-generator";

// Re-export analysis services
export { createASTAnalyzer, TypeScriptASTAnalyzer } from "./analysis/ast-analyzer";

export {
  createEnhancedFileScanner,
  EnhancedFileScanner,
  type EnhancedFileScannerOptions,
} from "./analysis/file-scanner";
