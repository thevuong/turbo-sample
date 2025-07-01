import { z } from "zod";

/**
 * CLI options validation schemas
 *
 * Following Single Responsibility Principle - this file only contains CLI options validation.
 */

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

// Type export for use in other files
export type GenerateExportsOptions = z.infer<typeof generateExportsOptionsSchema>;
