/**
 * AST Analysis Types for ts-morph integration
 *
 * These types define the structure for AST analysis results
 * and provide interfaces for AST-related services following SOLID principles.
 */

import type { Node, SourceFile, Symbol } from "ts-morph";

// Core AST Analysis Types
export interface FileAnalysis {
  /** Absolute path to the analyzed file */
  filePath: string;
  /** Source file object from ts-morph */
  sourceFile: SourceFile;
  /** All exports found in the file */
  exports: ExportInfo[];
  /** All imports found in the file */
  imports: ImportInfo[];
  /** Re-exports (export ... from ...) */
  reExports: ReExportInfo[];
  /** Type-only exports */
  typeExports: TypeExportInfo[];
  /** JSDoc comments at file level */
  fileComments: string[];
  /** Whether the file has any exports */
  hasExports: boolean;
  /** Whether the file is a declaration file (.d.ts) */
  isDeclarationFile: boolean;
}

export interface ProjectAnalysis {
  /** Root path of the analyzed project */
  projectPath: string;
  /** All analyzed files */
  files: Map<string, FileAnalysis>;
  /** Dependency graph between files */
  dependencies: DependencyGraph;
  /** Circular dependencies detected */
  circularDependencies: CircularDependency[];
  /** Export conflicts (same export name from different files) */
  exportConflicts: ExportConflict[];
}

export interface ExportInfo {
  /** Name of the exported symbol */
  name: string;
  /** Type of export (function, class, interface, type, const, etc.) */
  kind: ExportKind;
  /** Whether it's a default export */
  isDefault: boolean;
  /** Whether it's a type-only export */
  isTypeOnly: boolean;
  /** JSDoc comment if available */
  documentation?: string;
  /** Source location in the file */
  location: SourceLocation;
  /** TypeScript type information */
  typeInfo?: TypeInfo;
  /** Associated AST node */
  node: Node;
}

export interface ImportInfo {
  /** Module being imported from */
  moduleSpecifier: string;
  /** Named imports */
  namedImports: string[];
  /** Default import name */
  defaultImport?: string;
  /** Namespace import name */
  namespaceImport?: string;
  /** Whether it's a type-only import */
  isTypeOnly: boolean;
  /** Source location in the file */
  location: SourceLocation;
}

export interface ReExportInfo {
  /** Module being re-exported from */
  moduleSpecifier: string;
  /** Specific exports being re-exported (empty array means export *) */
  exports: string[];
  /** Whether it's export * from ... */
  isNamespaceReExport: boolean;
  /** Whether it's a type-only re-export */
  isTypeOnly: boolean;
  /** Source location in the file */
  location: SourceLocation;
}

export interface TypeExportInfo {
  /** Name of the exported type */
  name: string;
  /** Kind of type export (interface, type alias, enum, etc.) */
  kind: TypeExportKind;
  /** Whether it's a default export */
  isDefault: boolean;
  /** JSDoc comment if available */
  documentation?: string;
  /** Source location in the file */
  location: SourceLocation;
  /** Type definition details */
  typeDefinition: TypeDefinition;
}

export interface SourceLocation {
  /** Line number (1-based) */
  line: number;
  /** Column number (1-based) */
  column: number;
  /** End line number */
  endLine: number;
  /** End column number */
  endColumn: number;
}

export interface TypeInfo {
  /** TypeScript type text */
  typeText: string;
  /** Whether the type is generic */
  isGeneric: boolean;
  /** Generic type parameters */
  typeParameters: string[];
  /** Return type for functions */
  returnType?: string;
  /** Parameters for functions */
  parameters: ParameterInfo[];
}

export interface ParameterInfo {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: string;
  /** Whether parameter is optional */
  isOptional: boolean;
  /** Whether parameter is rest parameter */
  isRest: boolean;
}

export interface TypeDefinition {
  /** Full type definition text */
  definition: string;
  /** Properties for interfaces/objects */
  properties: PropertyInfo[];
  /** Methods for interfaces/classes */
  methods: MethodInfo[];
  /** Extends clause */
  extends: string[];
  /** Implements clause */
  implements: string[];
}

export interface PropertyInfo {
  /** Property name */
  name: string;
  /** Property type */
  type: string;
  /** Whether property is optional */
  isOptional: boolean;
  /** Whether property is readonly */
  isReadonly: boolean;
  /** JSDoc comment */
  documentation?: string;
}

export interface MethodInfo {
  /** Method name */
  name: string;
  /** Method signature */
  signature: string;
  /** Return type */
  returnType: string;
  /** Parameters */
  parameters: ParameterInfo[];
  /** Whether method is static */
  isStatic: boolean;
  /** Whether method is abstract */
  isAbstract: boolean;
  /** JSDoc comment */
  documentation?: string;
}

export interface DependencyGraph {
  /** Map of file path to its dependencies */
  dependencies: Map<string, string[]>;
  /** Map of file path to files that depend on it */
  dependents: Map<string, string[]>;
}

export interface CircularDependency {
  /** Files involved in the circular dependency */
  files: string[];
  /** Dependency chain showing the cycle */
  chain: string[];
}

export interface ExportConflict {
  /** Name of the conflicting export */
  exportName: string;
  /** Files that export the same name */
  conflictingFiles: string[];
  /** Types of the conflicting exports */
  exportTypes: ExportKind[];
}

export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
}

export interface ValidationError {
  /** Error message */
  message: string;
  /** File where error occurred */
  file: string;
  /** Source location of the error */
  location?: SourceLocation;
  /** Error code for categorization */
  code: string;
}

export interface ValidationWarning {
  /** Warning message */
  message: string;
  /** File where warning occurred */
  file: string;
  /** Source location of the warning */
  location?: SourceLocation;
  /** Warning code for categorization */
  code: string;
}

// Enums
export enum ExportKind {
  Function = "function",
  Class = "class",
  Interface = "interface",
  Type = "type",
  Enum = "enum",
  Const = "const",
  Let = "let",
  Variable = "var",
  Namespace = "namespace",
  Module = "module",
  Unknown = "unknown",
}

export enum TypeExportKind {
  Interface = "interface",
  TypeAlias = "type",
  Enum = "enum",
  Class = "class",
  Namespace = "namespace",
  Module = "module",
}

// Service Interfaces following SOLID principles

/**
 * Single Responsibility: Only analyzes AST
 */
export interface ASTAnalyzer {
  /** Analyze a single file */
  analyzeFile: (filePath: string) => Promise<FileAnalysis>;
  /** Analyze an entire project */
  analyzeProject: (projectPath: string) => Promise<ProjectAnalysis>;
  /** Get TypeScript compiler options */
  getCompilerOptions: () => Record<string, unknown>;
  /** Set TypeScript compiler options */
  setCompilerOptions: (options: Record<string, unknown>) => void;
}

/**
 * Single Responsibility: Only extracts export information from AST
 */
export interface ExportExtractor {
  /** Extract all exports from a file analysis */
  extractExports: (analysis: FileAnalysis) => ExportInfo[];
  /** Extract re-exports from a file analysis */
  extractReExports: (analysis: FileAnalysis) => ReExportInfo[];
  /** Extract type-only exports */
  extractTypeExports: (analysis: FileAnalysis) => TypeExportInfo[];
  /** Check if a symbol should be exported */
  shouldExport: (symbol: Symbol) => boolean;
}

/**
 * Single Responsibility: Only validates exports
 */
export interface ExportValidator {
  /** Validate exports for consistency and correctness */
  validateExports: (exports: ExportInfo[]) => ValidationResult;
  /** Check for circular dependencies in a project */
  checkCircularDependencies: (project: ProjectAnalysis) => CircularDependency[];
  /** Find export conflicts */
  findExportConflicts: (project: ProjectAnalysis) => ExportConflict[];
  /** Validate a single export */
  validateSingleExport: (exportInfo: ExportInfo) => ValidationError[];
}

/**
 * Interface Segregation: Separate file analysis from project analysis
 */
export interface FileAnalyzer {
  /** Analyze a single file */
  analyzeFile: (filePath: string) => Promise<FileAnalysis>;
}

export interface ProjectAnalyzer {
  /** Analyze an entire project */
  analyzeProject: (projectPath: string) => Promise<ProjectAnalysis>;
}

/**
 * Interface Segregation: Separate type checking functionality
 */
export interface TypeChecker {
  /** Check types in a file analysis */
  checkTypes: (analysis: FileAnalysis) => TypeCheckResult;
  /** Get type information for a symbol */
  getTypeInfo: (symbol: Symbol) => TypeInfo;
  /** Validate type compatibility */
  validateTypeCompatibility: (type1: string, type2: string) => boolean;
}

export interface TypeCheckResult {
  /** Whether type checking passed */
  success: boolean;
  /** Type errors found */
  errors: TypeCheckError[];
  /** Type warnings */
  warnings: TypeCheckWarning[];
}

export interface TypeCheckError {
  /** Error message */
  message: string;
  /** Source location */
  location: SourceLocation;
  /** Error code */
  code: string;
}

export interface TypeCheckWarning {
  /** Warning message */
  message: string;
  /** Source location */
  location: SourceLocation;
  /** Warning code */
  code: string;
}
