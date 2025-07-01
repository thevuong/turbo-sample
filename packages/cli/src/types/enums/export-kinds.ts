/**
 * Export kind enumerations
 *
 * These enums define the different types of exports that can be found in TypeScript/JavaScript files.
 * Following Single Responsibility Principle - this file only contains export kind enums.
 */

/**
 * Types of exports that can be found in a file
 */
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

/**
 * Types of type-only exports
 */
export enum TypeExportKind {
  Interface = "interface",
  TypeAlias = "type",
  Enum = "enum",
  Class = "class",
  Namespace = "namespace",
  Module = "module",
}
