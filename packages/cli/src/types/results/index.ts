/**
 * Result types index
 *
 * Re-exports all result types for convenient importing.
 * Following Single Responsibility Principle - this file only handles result type exports.
 */

// Validation result types
export type { ValidationResult, ValidationError, ValidationWarning } from "@/types/results/validation";

// Type checking result types
export type { TypeCheckResult, TypeCheckError, TypeCheckWarning } from "@/types/results/type-checking";
