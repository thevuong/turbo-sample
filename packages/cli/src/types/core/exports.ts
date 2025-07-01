/**
 * Export-related data models
 *
 * These types represent export, import, and re-export information from AST analysis.
 * Following Single Responsibility Principle - this file only contains export data models.
 */

import type { SourceLocation, TypeDefinition, TypeInfo } from "@/types/core/source";
import type { ExportKind, TypeExportKind } from "@/types/enums";
import type { Node } from "ts-morph";

/**
 * Information about an exported symbol
 */
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

/**
 * Information about an imported symbol
 */
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

/**
 * Information about a re-exported symbol
 */
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

/**
 * Information about a type-only export
 */
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
