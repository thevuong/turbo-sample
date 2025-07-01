/**
 * Extractor service interfaces
 *
 * These interfaces define contracts for export extraction services.
 * Following Single Responsibility Principle.
 */

import type { ExportInfo, FileAnalysis, ReExportInfo, TypeExportInfo, TypeInfo } from "@/types//core";
import type { Symbol } from "ts-morph";

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
 * Interface Segregation: Separate type checking functionality
 */
export interface TypeChecker {
  /** Get type information for a symbol */
  getTypeInfo: (symbol: Symbol) => TypeInfo;
  /** Validate type compatibility */
  validateTypeCompatibility: (type1: string, type2: string) => boolean;
}
