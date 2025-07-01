/**
 * Core types and interfaces for the CLI package
 * Re-exports from modular type files for better organization
 */

// Re-export interfaces from modular files
export type { PackageInfo, PackageManager } from "@/types/package";

export type { FileScanner, ExportGenerator } from "@/types/processing";

export type { Logger, ConfigLoader, CLICommand } from "@/types/infrastructure";

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

// Export AST analysis types
export type {
  // Core analysis types
  FileAnalysis,
  ProjectAnalysis,
  ExportInfo,
  ImportInfo,
  ReExportInfo,
  TypeExportInfo,
  SourceLocation,
  TypeInfo,
  ParameterInfo,
  TypeDefinition,
  PropertyInfo,
  MethodInfo,
  DependencyGraph,
  CircularDependency,
  ExportConflict,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  TypeCheckResult,
  TypeCheckError,
  TypeCheckWarning,

  // Service interfaces
  ASTAnalyzer,
  ExportExtractor,
  ExportValidator,
  FileAnalyzer,
  ProjectAnalyzer,
  TypeChecker,
} from "@/types/ast";

// Export enums as values (not just types)
export { ExportKind, TypeExportKind } from "@/types/ast";
