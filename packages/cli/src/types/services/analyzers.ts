/**
 * Analyzer service interfaces
 *
 * These interfaces define contracts for AST analysis services.
 * Following Single Responsibility and Interface Segregation Principles.
 */

import type { FileAnalysis, ProjectAnalysis } from "@/types/core";

/**
 * Single Responsibility: Only analyzes AST
 */
export interface ASTAnalyzer {
  /** Analyze a single file */
  analyzeFile: (filePath: string) => Promise<FileAnalysis>;
  /** Analyze an entire project */
  analyzeProject: (projectPath: string) => Promise<ProjectAnalysis>;
  /** Get TypeScript compiler options */
  getCompilerOptions: () => Record<string, unknown>;
  /** Set TypeScript compiler options */
  setCompilerOptions: (options: Record<string, unknown>) => void;
}

/**
 * Interface Segregation: Separate file analysis from project analysis
 */
export interface FileAnalyzer {
  /** Analyze a single file */
  analyzeFile: (filePath: string) => Promise<FileAnalysis>;
}

/**
 * Interface Segregation: Separate project analysis from file analysis
 */
export interface ProjectAnalyzer {
  /** Analyze an entire project */
  analyzeProject: (projectPath: string) => Promise<ProjectAnalysis>;
}
