/**
 * Package management service interfaces
 *
 * These interfaces define contracts for package management operations.
 * Following Single Responsibility Principle - this file only contains package management service interfaces.
 */

import type { PackageJson } from "@/schemas/validation";

export interface PackageManager {
  /** Update package.json with new exports */
  updatePackageJson: (packagePath: string, exports: Record<string, unknown>) => Promise<void>;
  /** Read package.json from a directory */
  readPackageJson: (packagePath: string) => Promise<PackageJson>;
  /** Backup package.json before making changes */
  backupPackageJson: (packagePath: string) => Promise<string>;
}
