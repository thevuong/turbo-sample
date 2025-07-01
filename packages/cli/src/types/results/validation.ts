/**
 * Validation result types
 *
 * These types represent the results of validation operations.
 * Following Single Responsibility Principle - this file only contains validation result types.
 */

import type { SourceLocation } from "@/types/core";

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
}

/**
 * Validation error information
 */
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

/**
 * Validation warning information
 */
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
