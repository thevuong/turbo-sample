/**
 * Validator service interfaces
 *
 * These interfaces define contracts for validation services.
 * Following Single Responsibility Principle.
 */

import type { CircularDependency, ExportConflict, ExportInfo, ProjectAnalysis } from "@/types//core";
import type { ValidationError, ValidationResult } from "@/types/results";

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
