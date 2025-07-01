/**
 * Dependency and conflict models
 *
 * These types represent dependency relationships and conflicts between files.
 * Following Single Responsibility Principle - this file only contains dependency-related data models.
 */

import type { ExportKind } from "@/types/enums";

/**
 * Dependency graph between files
 */
export interface DependencyGraph {
  /** Map of file path to its dependencies */
  dependencies: Map<string, string[]>;
  /** Map of file path to files that depend on it */
  dependents: Map<string, string[]>;
}

/**
 * Circular dependency information
 */
export interface CircularDependency {
  /** Files involved in the circular dependency */
  files: string[];
  /** Dependency chain showing the cycle */
  chain: string[];
}

/**
 * Export conflict information
 */
export interface ExportConflict {
  /** Name of the conflicting export */
  exportName: string;
  /** Files that export the same name */
  conflictingFiles: string[];
  /** Types of the conflicting exports */
  exportTypes: ExportKind[];
}
