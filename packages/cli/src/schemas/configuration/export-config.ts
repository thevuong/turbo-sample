import { z } from "zod";

/**
 * Export configuration validation schemas
 *
 * Following Single Responsibility Principle - this file only contains export configuration validation.
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

// Type exports for use in other files
export type ExportConfig = z.infer<typeof exportConfigSchema>;
export type ExportsConfigFile = z.infer<typeof exportsConfigFileSchema>;
export type ExportPriorityConfig = z.infer<typeof exportPriorityConfigSchema>;
export type CategoryConfig = z.infer<typeof categoryConfigSchema>;
