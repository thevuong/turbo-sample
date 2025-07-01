/**
 * Core types and interfaces for the CLI package
 * Re-exports from modular type files for better organization
 */

// Re-export data models
export type { PackageInfo } from "@/types/models/package";

export type {
  ExportPriorityConfig,
  GenerateExportsOptions,
  PackageExport,
  PackageJson,
  CategoryConfig,
  ExportGeneratorOptions,
  ExportConfig,
  ExportsConfigFile,
} from "@/schemas/validation";

// Export core data models
export type {
  // Analysis models
  FileAnalysis,
  ProjectAnalysis,
  // Export-related models
  ExportInfo,
  ImportInfo,
  ReExportInfo,
  TypeExportInfo,
  // Source and type information models
  SourceLocation,
  TypeInfo,
  ParameterInfo,
  TypeDefinition,
  PropertyInfo,
  MethodInfo,
  // Dependency models
  DependencyGraph,
  CircularDependency,
  ExportConflict,
} from "@/types/core";

// Export enumerations (both as types and values)
export { ExportKind, TypeExportKind } from "@/types/enums";

// Export service interfaces
export type {
  // Analyzer services
  ASTAnalyzer,
  FileAnalyzer,
  ProjectAnalyzer,
  // Extractor services
  ExportExtractor,
  TypeChecker,
  // Validator services
  ExportValidator,
  // Package management services
  PackageManager,
  // File processing services
  FileScanner,
  ExportGenerator,
  // Infrastructure services
  Logger,
  ConfigLoader,
  CLICommand,
} from "@/types/services";

// Export result types
export type {
  // Validation result types
  ValidationResult,
  ValidationError,
  ValidationWarning,
  // Type checking result types
  TypeCheckResult,
  TypeCheckError,
  TypeCheckWarning,
} from "@/types/results";
