/**
 * Source location and type information models
 *
 * These types represent source code location and TypeScript type information.
 * Following Single Responsibility Principle - this file only contains source-related data models.
 */

/**
 * Source location information in a file
 */
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

/**
 * TypeScript type information
 */
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

/**
 * Function parameter information
 */
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

/**
 * Type definition details
 */
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

/**
 * Property information for interfaces/classes
 */
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

/**
 * Method information for interfaces/classes
 */
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
