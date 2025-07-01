import { z } from "zod";

/**
 * Package.json validation schema
 *
 * Following Single Responsibility Principle - this file only contains package.json validation.
 */

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

// Type export for use in other files
export type PackageJson = z.infer<typeof packageJsonSchema>;
