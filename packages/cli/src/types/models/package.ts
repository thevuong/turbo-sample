/**
 * Package-related data models
 *
 * Following Single Responsibility Principle - this file only contains package data models.
 */

import type { PackageJson, PackageExport } from "@/schemas/validation";

export interface PackageInfo {
  /** Package name */
  name: string;
  /** Absolute path to the package directory */
  path: string;
  /** Relative path from monorepo root */
  relativePath: string;
  /** Current package.json content */
  packageJson: PackageJson;
  /** Detected exports from source files */
  detectedExports: PackageExport[];
}
