import { z } from "zod";

/**
 * Package export validation schemas
 *
 * Following Single Responsibility Principle - this file only contains package export validation.
 */

// Schema for package export
export const packageExportSchema = z.object({
  key: z.string(),
  sourcePath: z.string(),
  dualFormat: z.boolean(),
  hasTypes: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Schema for export generator options
export const exportGeneratorOptionsSchema = z.object({
  dualFormat: z.boolean(),
  distDir: z.string(),
  esmDir: z.string(),
  cjsDir: z.string(),
  extensions: z.object({
    esm: z.string(),
    cjs: z.string(),
    types: z.string(),
  }),
  exportPriorities: z.record(z.string(), z.number()).optional(),
});

// Type exports for use in other files
export type PackageExport = z.infer<typeof packageExportSchema>;
export type ExportGeneratorOptions = z.infer<typeof exportGeneratorOptionsSchema>;
