/**
 * Type checking result types
 *
 * These types represent the results of type checking operations.
 * Following Single Responsibility Principle - this file only contains type checking result types.
 */

import type { SourceLocation } from "@/types/core";

/**
 * Result of a type checking operation
 */
export interface TypeCheckResult {
  /** Whether type checking passed */
  success: boolean;
  /** Type errors found */
  errors: TypeCheckError[];
  /** Type warnings */
  warnings: TypeCheckWarning[];
}

/**
 * Type checking error information
 */
export interface TypeCheckError {
  /** Error message */
  message: string;
  /** Source location */
  location: SourceLocation;
  /** Error code */
  code: string;
}

/**
 * Type checking warning information
 */
export interface TypeCheckWarning {
  /** Warning message */
  message: string;
  /** Source location */
  location: SourceLocation;
  /** Warning code */
  code: string;
}
