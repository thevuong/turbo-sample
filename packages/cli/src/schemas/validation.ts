import { z } from "zod";

/**
 * Zod validation schemas for CLI types
 * Provides runtime validation with detailed error messages
 */

// Schema for export priorities configuration
export const exportPriorityConfigSchema = z.record(z.string(), z.number());

// Schema for category configuration
export const categoryConfigSchema = z.record(z.string(), z.string());

// Schema for export configuration
export const exportConfigSchema = z.object({
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  mappings: z.record(z.string(), z.string()).optional(),
  dualFormat: z.boolean().optional(),
  exportPriorities: exportPriorityConfigSchema.optional(),
});

// Schema for exports configuration file
export const exportsConfigFileSchema = z
  .object({
    global: exportConfigSchema.optional(),
    packages: z.record(z.string(), exportConfigSchema).optional(),
  })
  .refine(
    (data: { global?: unknown; packages?: unknown }) => data.global !== undefined || data.packages !== undefined,
    {
      message: "Configuration must have either 'global' or 'packages' property",
    },
  );

// Schema for package.json validation
export const packageJsonSchema = z
  .object({
    name: z.string().min(1, "Package name is required"),
    version: z.string().min(1, "Package version is required"),
    type: z.enum(["module", "commonjs"]).optional(),
    exports: z.record(z.string(), z.unknown()).optional(),
    main: z.string().optional(),
    module: z.string().optional(),
    types: z.string().optional(),
  })
  .catchall(z.unknown()); // Allow additional properties

// Schema for CLI generate exports options
export const generateExportsOptionsSchema = z.object({
  package: z.string().optional(),
  dualFormat: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  backup: z.boolean().optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  mappings: z.record(z.string(), z.string()).optional(),
  config: z.string().optional(),
});

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
  exportPriorities: exportPriorityConfigSchema.optional(),
});

// Type exports for use in other files
export type ExportConfig = z.infer<typeof exportConfigSchema>;
export type ExportsConfigFile = z.infer<typeof exportsConfigFileSchema>;
export type PackageJson = z.infer<typeof packageJsonSchema>;
export type GenerateExportsOptions = z.infer<typeof generateExportsOptionsSchema>;
export type PackageExport = z.infer<typeof packageExportSchema>;
export type ExportGeneratorOptions = z.infer<typeof exportGeneratorOptionsSchema>;
export type ExportPriorityConfig = z.infer<typeof exportPriorityConfigSchema>;
export type CategoryConfig = z.infer<typeof categoryConfigSchema>;
