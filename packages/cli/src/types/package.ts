/**
 * Package-related types and interfaces
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

export interface PackageManager {
  /** Update package.json with new exports */
  updatePackageJson: (packagePath: string, exports: Record<string, unknown>) => Promise<void>;
  /** Read package.json from a directory */
  readPackageJson: (packagePath: string) => Promise<PackageJson>;
  /** Backup package.json before making changes */
  backupPackageJson: (packagePath: string) => Promise<string>;
}
