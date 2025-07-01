/**
 * AST Analyzer Service using ts-morph
 *
 * This service implements the ASTAnalyzer interface and provides
 * TypeScript/JavaScript AST analysis capabilities using ts-morph.
 *
 * Follows Single Responsibility Principle - only handles AST analysis.
 */

import path from "node:path";

import { Project, SyntaxKind, ts } from "ts-morph";

import { ExportKind, TypeExportKind } from "@/types";

import type {
  ASTAnalyzer,
  CircularDependency,
  DependencyGraph,
  ExportConflict,
  ExportInfo,
  FileAnalysis,
  ImportInfo,
  Logger,
  ProjectAnalysis,
  ReExportInfo,
  SourceLocation,
  TypeDefinition,
  TypeExportInfo,
} from "@/types";
import type { Node, SourceFile } from "ts-morph";

/**
 * TypeScript AST Analyzer implementation using ts-morph
 *
 * This class follows the Single Responsibility Principle by focusing
 * solely on AST analysis and parsing.
 */
export class TypeScriptASTAnalyzer implements ASTAnalyzer {
  private readonly project: Project;
  private compilerOptions: Record<string, unknown>;

  constructor(
    private readonly logger: Logger,
    compilerOptions?: Record<string, unknown>,
  ) {
    this.compilerOptions = {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      skipLibCheck: true,
      strict: true,
      ...compilerOptions,
    };

    this.project = new Project({
      compilerOptions: this.compilerOptions as ts.CompilerOptions,
      useInMemoryFileSystem: false,
    });
  }

  async analyzeFile(filePath: string): Promise<FileAnalysis> {
    try {
      this.logger.info(`Analyzing file: ${filePath}`);

      const absolutePath = path.resolve(filePath);
      const sourceFile = this.project.addSourceFileAtPath(absolutePath);

      const analysis: FileAnalysis = {
        filePath: absolutePath,
        sourceFile,
        exports: this.extractExports(sourceFile),
        imports: this.extractImports(sourceFile),
        reExports: this.extractReExports(sourceFile),
        typeExports: this.extractTypeExports(sourceFile),
        fileComments: this.extractFileComments(sourceFile),
        hasExports: false,
        isDeclarationFile: filePath.endsWith(".d.ts"),
      };

      analysis.hasExports =
        analysis.exports.length > 0 || analysis.reExports.length > 0 || analysis.typeExports.length > 0;

      this.logger.success(`Analyzed file: ${filePath} (${analysis.exports.length} exports found)`);
      return analysis;
    } catch (error) {
      this.logger.error(`Failed to analyze file ${filePath}: ${String(error)}`);
      throw error;
    }
  }

  async analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
    try {
      this.logger.startSpinner(`Analyzing project: ${projectPath}`);

      const absoluteProjectPath = path.resolve(projectPath);

      // Add all TypeScript/JavaScript files in the project
      this.project.addSourceFilesAtPaths([
        `${absoluteProjectPath}/**/*.{ts,tsx,js,jsx}`,
        `!${absoluteProjectPath}/**/node_modules/**`,
        `!${absoluteProjectPath}/**/dist/**`,
        `!${absoluteProjectPath}/**/build/**`,
        `!${absoluteProjectPath}/**/*.test.{ts,tsx,js,jsx}`,
        `!${absoluteProjectPath}/**/*.spec.{ts,tsx,js,jsx}`,
      ]);

      const files = new Map<string, FileAnalysis>();
      const sourceFiles = this.project.getSourceFiles();

      // Analyze each file
      for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        const analysis = await this.analyzeSourceFile(sourceFile);
        files.set(filePath, analysis);
      }

      // Build dependency graph
      const dependencies = this.buildDependencyGraph(files);

      // Detect circular dependencies
      const circularDependencies = this.detectCircularDependencies(dependencies);

      // Find export conflicts
      const exportConflicts = this.findExportConflicts(files);

      const projectAnalysis: ProjectAnalysis = {
        projectPath: absoluteProjectPath,
        files,
        dependencies,
        circularDependencies,
        exportConflicts,
      };

      this.logger.stopSpinner(
        `Project analyzed: ${files.size} files, ${circularDependencies.length} circular dependencies`,
      );
      return projectAnalysis;
    } catch (error) {
      this.logger.failSpinner(`Failed to analyze project: ${String(error)}`);
      throw error;
    }
  }

  getCompilerOptions(): Record<string, unknown> {
    return { ...this.compilerOptions };
  }

  setCompilerOptions(options: Record<string, unknown>): void {
    this.compilerOptions = { ...this.compilerOptions, ...options };
    this.project.compilerOptions.set(this.compilerOptions as ts.CompilerOptions);
  }

  private async analyzeSourceFile(sourceFile: SourceFile): Promise<FileAnalysis> {
    const filePath = sourceFile.getFilePath();

    const analysis: FileAnalysis = {
      filePath,
      sourceFile,
      exports: this.extractExports(sourceFile),
      imports: this.extractImports(sourceFile),
      reExports: this.extractReExports(sourceFile),
      typeExports: this.extractTypeExports(sourceFile),
      fileComments: this.extractFileComments(sourceFile),
      hasExports: false,
      isDeclarationFile: filePath.endsWith(".d.ts"),
    };

    analysis.hasExports =
      analysis.exports.length > 0 || analysis.reExports.length > 0 || analysis.typeExports.length > 0;

    return analysis;
  }

  private extractExports(sourceFile: SourceFile): ExportInfo[] {
    const exports: ExportInfo[] = [];

    // Extract named exports
    for (const exportDecl of sourceFile.getExportDeclarations()) {
      const namedExports = exportDecl.getNamedExports();
      for (const namedExport of namedExports) {
        const name = namedExport.getName();
        exports.push({
          name,
          kind: ExportKind.Unknown, // Will be determined by analyzing the symbol
          isDefault: false,
          isTypeOnly: exportDecl.isTypeOnly() || namedExport.isTypeOnly(),
          location: this.getSourceLocation(namedExport),
          node: namedExport,
        });
      }
    }

    // Extract default exports
    for (const exportAssignment of sourceFile.getExportAssignments()) {
      if (exportAssignment.isExportEquals()) continue;

      exports.push({
        name: "default",
        kind: ExportKind.Unknown,
        isDefault: true,
        isTypeOnly: false,
        location: this.getSourceLocation(exportAssignment),
        node: exportAssignment,
      });
    }

    // Extract exported functions, classes, interfaces, etc.
    for (const function_ of sourceFile.getFunctions()) {
      if (function_.isExported()) {
        exports.push(
          this.createExportInfo(
            function_.isDefaultExport() ? "default" : (function_.getName() ?? "default"),
            ExportKind.Function,
            function_.isDefaultExport(),
            false,
            this.getSourceLocation(function_),
            function_,
            this.extractJSDoc(function_),
          ),
        );
      }
    }

    for (const cls of sourceFile.getClasses()) {
      if (cls.isExported()) {
        exports.push(
          this.createExportInfo(
            cls.isDefaultExport() ? "default" : (cls.getName() ?? "default"),
            ExportKind.Class,
            cls.isDefaultExport(),
            false,
            this.getSourceLocation(cls),
            cls,
            this.extractJSDoc(cls),
          ),
        );
      }
    }

    for (const iface of sourceFile.getInterfaces()) {
      if (iface.isExported()) {
        exports.push(
          this.createExportInfo(
            iface.getName(),
            ExportKind.Interface,
            iface.isDefaultExport(),
            true,
            this.getSourceLocation(iface),
            iface,
            this.extractJSDoc(iface),
          ),
        );
      }
    }

    for (const typeAlias of sourceFile.getTypeAliases()) {
      if (typeAlias.isExported()) {
        exports.push(
          this.createExportInfo(
            typeAlias.getName(),
            ExportKind.Type,
            typeAlias.isDefaultExport(),
            true,
            this.getSourceLocation(typeAlias),
            typeAlias,
            this.extractJSDoc(typeAlias),
          ),
        );
      }
    }

    for (const enumDecl of sourceFile.getEnums()) {
      if (enumDecl.isExported()) {
        exports.push(
          this.createExportInfo(
            enumDecl.getName(),
            ExportKind.Enum,
            enumDecl.isDefaultExport(),
            false,
            this.getSourceLocation(enumDecl),
            enumDecl,
            this.extractJSDoc(enumDecl),
          ),
        );
      }
    }

    for (const variableStatement of sourceFile.getVariableStatements()) {
      if (variableStatement.isExported()) {
        for (const decl of variableStatement.getDeclarations()) {
          const name = decl.getName();
          const declarationKind = variableStatement.getDeclarationKind();

          let kind: ExportKind;
          if (declarationKind === "const") {
            kind = ExportKind.Const;
          } else if (declarationKind === "let") {
            kind = ExportKind.Let;
          } else {
            kind = ExportKind.Variable;
          }

          exports.push(
            this.createExportInfo(
              name,
              kind,
              variableStatement.isDefaultExport(),
              false,
              this.getSourceLocation(decl),
              decl,
              this.extractJSDoc(variableStatement),
            ),
          );
        }
      }
    }

    return exports;
  }

  private createExportInfo(
    name: string,
    kind: ExportKind,
    isDefault: boolean,
    isTypeOnly: boolean,
    location: SourceLocation,
    node: Node,
    documentation?: string,
  ): ExportInfo {
    const exportInfo: ExportInfo = {
      name,
      kind,
      isDefault,
      isTypeOnly,
      location,
      node,
    };

    if (documentation !== undefined) {
      exportInfo.documentation = documentation;
    }

    return exportInfo;
  }

  private createTypeExportInfo(
    name: string,
    kind: TypeExportKind,
    isDefault: boolean,
    location: SourceLocation,
    typeDefinition: TypeDefinition,
    documentation?: string,
  ): TypeExportInfo {
    const typeExportInfo: TypeExportInfo = {
      name,
      kind,
      isDefault,
      location,
      typeDefinition,
    };

    if (documentation !== undefined) {
      typeExportInfo.documentation = documentation;
    }

    return typeExportInfo;
  }

  private extractImports(sourceFile: SourceFile): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (const importDecl of sourceFile.getImportDeclarations()) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const namedImports: string[] = [];
      let defaultImport: string | undefined;
      let namespaceImport: string | undefined;

      // Named imports
      const namedImportsClause = importDecl.getNamedImports();
      for (const namedImport of namedImportsClause) {
        namedImports.push(namedImport.getName());
      }

      // Default import
      const defaultImportClause = importDecl.getDefaultImport();
      if (defaultImportClause) {
        defaultImport = defaultImportClause.getText();
      }

      // Namespace import
      const namespaceImportClause = importDecl.getNamespaceImport();
      if (namespaceImportClause) {
        namespaceImport = namespaceImportClause.getText();
      }

      const importInfo: ImportInfo = {
        moduleSpecifier,
        namedImports,
        isTypeOnly: importDecl.isTypeOnly(),
        location: this.getSourceLocation(importDecl),
      };

      // Only add optional properties if they have values
      if (defaultImport !== undefined) {
        importInfo.defaultImport = defaultImport;
      }
      if (namespaceImport !== undefined) {
        importInfo.namespaceImport = namespaceImport;
      }

      imports.push(importInfo);
    }

    return imports;
  }

  private extractReExports(sourceFile: SourceFile): ReExportInfo[] {
    const reExports: ReExportInfo[] = [];

    for (const exportDecl of sourceFile.getExportDeclarations()) {
      const moduleSpecifier = exportDecl.getModuleSpecifierValue();
      if (!moduleSpecifier) continue;

      const namedExports = exportDecl.getNamedExports();
      const exports = namedExports.map(namedExport => namedExport.getName());

      reExports.push({
        moduleSpecifier,
        exports,
        isNamespaceReExport: namedExports.length === 0,
        isTypeOnly: exportDecl.isTypeOnly(),
        location: this.getSourceLocation(exportDecl),
      });
    }

    return reExports;
  }

  private extractTypeExports(sourceFile: SourceFile): TypeExportInfo[] {
    const typeExports: TypeExportInfo[] = [];

    // Extract exported interfaces
    for (const iface of sourceFile.getInterfaces()) {
      if (iface.isExported()) {
        typeExports.push(
          this.createTypeExportInfo(
            iface.getName(),
            TypeExportKind.Interface,
            iface.isDefaultExport(),
            this.getSourceLocation(iface),
            {
              definition: iface.getText(),
              properties: [],
              methods: [],
              extends: iface.getExtends().map(extension => extension.getText()),
              implements: [],
            },
            this.extractJSDoc(iface),
          ),
        );
      }
    }

    // Extract exported type aliases
    for (const typeAlias of sourceFile.getTypeAliases()) {
      if (typeAlias.isExported()) {
        typeExports.push(
          this.createTypeExportInfo(
            typeAlias.getName(),
            TypeExportKind.TypeAlias,
            typeAlias.isDefaultExport(),
            this.getSourceLocation(typeAlias),
            {
              definition: typeAlias.getText(),
              properties: [],
              methods: [],
              extends: [],
              implements: [],
            },
            this.extractJSDoc(typeAlias),
          ),
        );
      }
    }

    // Extract exported enums
    for (const enumDecl of sourceFile.getEnums()) {
      if (enumDecl.isExported()) {
        typeExports.push(
          this.createTypeExportInfo(
            enumDecl.getName(),
            TypeExportKind.Enum,
            enumDecl.isDefaultExport(),
            this.getSourceLocation(enumDecl),
            {
              definition: enumDecl.getText(),
              properties: [],
              methods: [],
              extends: [],
              implements: [],
            },
            this.extractJSDoc(enumDecl),
          ),
        );
      }
    }

    return typeExports;
  }

  private extractFileComments(sourceFile: SourceFile): string[] {
    const comments: string[] = [];

    // Extract leading comments
    const leadingComments = sourceFile.getLeadingCommentRanges();
    for (const comment of leadingComments) {
      const text = sourceFile.getFullText().slice(comment.getPos(), comment.getEnd());
      comments.push(text.trim());
    }

    return comments;
  }

  private extractJSDoc(node: Node): string | undefined {
    const jsDocumentNodes = node.getChildren().filter(child => child.getKind() === SyntaxKind.JSDocComment);

    if (jsDocumentNodes.length > 0 && jsDocumentNodes[0]) {
      return jsDocumentNodes[0].getText().trim();
    }

    return undefined;
  }

  private getSourceLocation(node: Node): SourceLocation {
    const start = node.getStart();
    const end = node.getEnd();
    const sourceFile = node.getSourceFile();

    const startLineAndColumn = sourceFile.getLineAndColumnAtPos(start);
    const endLineAndColumn = sourceFile.getLineAndColumnAtPos(end);

    return {
      line: startLineAndColumn.line,
      column: startLineAndColumn.column,
      endLine: endLineAndColumn.line,
      endColumn: endLineAndColumn.column,
    };
  }

  private buildDependencyGraph(files: Map<string, FileAnalysis>): DependencyGraph {
    const dependencies = new Map<string, string[]>();
    const dependents = new Map<string, string[]>();

    for (const [filePath, analysis] of files.entries()) {
      const fileDependencies: string[] = [];

      // Add dependencies from imports
      for (const importInfo of analysis.imports) {
        const resolvedPath = this.resolveModulePath(importInfo.moduleSpecifier, filePath);
        if (resolvedPath && files.has(resolvedPath)) {
          fileDependencies.push(resolvedPath);

          // Add to dependents map
          if (!dependents.has(resolvedPath)) {
            dependents.set(resolvedPath, []);
          }
          const dependentsList = dependents.get(resolvedPath);
          if (dependentsList) {
            dependentsList.push(filePath);
          }
        }
      }

      // Add dependencies from re-exports
      for (const reExportInfo of analysis.reExports) {
        const resolvedPath = this.resolveModulePath(reExportInfo.moduleSpecifier, filePath);
        if (resolvedPath && files.has(resolvedPath)) {
          fileDependencies.push(resolvedPath);

          // Add to dependents map
          if (!dependents.has(resolvedPath)) {
            dependents.set(resolvedPath, []);
          }
          const dependentsList = dependents.get(resolvedPath);
          if (dependentsList) {
            dependentsList.push(filePath);
          }
        }
      }

      dependencies.set(filePath, fileDependencies);
    }

    return { dependencies, dependents };
  }

  private resolveModulePath(moduleSpecifier: string, fromFile: string): string | null {
    // Simple resolution - in a real implementation, this would use TypeScript's module resolution
    if (moduleSpecifier.startsWith(".")) {
      const directory = path.dirname(fromFile);
      const resolved = path.resolve(directory, moduleSpecifier);

      // Try different extensions
      const extensions = [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.js"];
      for (const extension of extensions) {
        const fullPath = resolved + extension;
        if (this.project.getSourceFile(fullPath)) {
          return fullPath;
        }
      }
    }

    return null;
  }

  private detectCircularDependencies(dependencyGraph: DependencyGraph): CircularDependency[] {
    const circularDependencies: CircularDependency[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (file: string, path: string[]): void => {
      if (recursionStack.has(file)) {
        // Found a cycle
        const cycleStart = path.indexOf(file);
        const cycle = path.slice(cycleStart);
        cycle.push(file); // Complete the cycle

        circularDependencies.push({
          files: [...new Set(cycle)],
          chain: cycle,
        });
        return;
      }

      if (visited.has(file)) {
        return;
      }

      visited.add(file);
      recursionStack.add(file);

      const dependencies = dependencyGraph.dependencies.get(file) ?? [];
      for (const dependency of dependencies) {
        dfs(dependency, [...path, file]);
      }

      recursionStack.delete(file);
    };

    for (const [file] of dependencyGraph.dependencies.entries()) {
      if (!visited.has(file)) {
        dfs(file, []);
      }
    }

    return circularDependencies;
  }

  private findExportConflicts(files: Map<string, FileAnalysis>): ExportConflict[] {
    const exportMap = new Map<string, { files: string[]; kinds: ExportKind[] }>();

    // Collect all exports
    for (const [filePath, analysis] of files.entries()) {
      for (const exportInfo of analysis.exports) {
        if (!exportMap.has(exportInfo.name)) {
          exportMap.set(exportInfo.name, { files: [], kinds: [] });
        }

        const entry = exportMap.get(exportInfo.name);
        if (entry) {
          entry.files.push(filePath);
          entry.kinds.push(exportInfo.kind);
        }
      }
    }

    // Find conflicts (same export name from multiple files)
    const conflicts: ExportConflict[] = [];
    for (const [exportName, entry] of exportMap.entries()) {
      if (entry.files.length > 1) {
        conflicts.push({
          exportName,
          conflictingFiles: entry.files,
          exportTypes: entry.kinds,
        });
      }
    }

    return conflicts;
  }
}

/**
 * Factory function to create a TypeScript AST Analyzer
 * Follows Dependency Inversion Principle by depending on abstractions
 */
export function createASTAnalyzer(logger: Logger, compilerOptions?: Record<string, unknown>): ASTAnalyzer {
  return new TypeScriptASTAnalyzer(logger, compilerOptions);
}
