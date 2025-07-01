/**
 * Core analysis data models
 *
 * These types represent the fundamental data structures for AST analysis results.
 * Following Single Responsibility Principle - this file only contains analysis data models.
 */

import type { CircularDependency, DependencyGraph, ExportConflict } from "@/types/core/dependencies";
import type { ExportInfo, ImportInfo, ReExportInfo, TypeExportInfo } from "@/types/core/exports";
import type { SourceFile } from "ts-morph";

/**
 * Analysis result for a single file
 */
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

/**
 * Analysis result for an entire project
 */
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
