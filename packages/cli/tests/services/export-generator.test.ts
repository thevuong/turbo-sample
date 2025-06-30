import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { createExportGenerator, DEFAULT_EXPORT_OPTIONS, StandardExportGenerator } from "@/services/export-generator";
import { createLogger } from "@/services/logger";

import type { ExportGeneratorOptions, Logger, PackageExport } from "@/types";

describe("ExportGenerator Service", () => {
  let logger: Logger;
  let generator: StandardExportGenerator;

  beforeEach(() => {
    logger = createLogger();
    // Mock logger methods to avoid console output during tests
    jest.spyOn(logger, "startSpinner").mockImplementation(() => {
      // Intentionally empty for testing
    });
    jest.spyOn(logger, "stopSpinner").mockImplementation(() => {
      // Intentionally empty for testing
    });
    jest.spyOn(logger, "failSpinner").mockImplementation(() => {
      // Intentionally empty for testing
    });
    jest.spyOn(logger, "warn").mockImplementation(() => {
      // Intentionally empty for testing
    });
    jest.spyOn(logger, "error").mockImplementation(() => {
      // Intentionally empty for testing
    });

    generator = new StandardExportGenerator(logger);
  });

  describe("generateExports", () => {
    test("should generate dual format exports for TypeScript files", () => {
      const exports: PackageExport[] = [
        {
          key: ".",
          sourcePath: "src/index.ts",
          dualFormat: true,
          hasTypes: true,
        },
        {
          key: "./core/javascript",
          sourcePath: "src/core/javascript.ts",
          dualFormat: true,
          hasTypes: true,
        },
      ];

      const result = generator.generateExports(exports, DEFAULT_EXPORT_OPTIONS);

      expect(result).toEqual({
        ".": {
          import: {
            default: "./dist/esm/index.js",
            types: "./dist/esm/index.d.ts",
          },
          require: {
            default: "./dist/cjs/index.cjs",
            types: "./dist/cjs/index.d.ts",
          },
        },
        "./core/javascript": {
          import: {
            default: "./dist/esm/core/javascript.js",
            types: "./dist/esm/core/javascript.d.ts",
          },
          require: {
            default: "./dist/cjs/core/javascript.cjs",
            types: "./dist/cjs/core/javascript.d.ts",
          },
        },
      });
    });

    test("should generate simple exports for JSON files", () => {
      const exports: PackageExport[] = [
        {
          key: "./base",
          sourcePath: "base.json",
          dualFormat: false,
          hasTypes: false,
        },
        {
          key: "./react",
          sourcePath: "react.json",
          dualFormat: false,
          hasTypes: false,
        },
      ];

      const result = generator.generateExports(exports, DEFAULT_EXPORT_OPTIONS);

      expect(result).toEqual({
        "./base": "./base.json",
        "./react": "./react.json",
      });
    });

    test("should generate single format exports when dual format is disabled", () => {
      const exports: PackageExport[] = [
        {
          key: ".",
          sourcePath: "src/index.ts",
          dualFormat: false,
          hasTypes: true,
        },
      ];

      const options: ExportGeneratorOptions = {
        ...DEFAULT_EXPORT_OPTIONS,
        dualFormat: false,
      };

      const result = generator.generateExports(exports, options);

      expect(result).toEqual({
        ".": "./dist/esm/index.js",
      });
    });

    test("should sort exports with main export first", () => {
      const exports: PackageExport[] = [
        {
          key: "./utils/composer",
          sourcePath: "src/utils/composer.ts",
          dualFormat: true,
          hasTypes: true,
        },
        {
          key: ".",
          sourcePath: "src/index.ts",
          dualFormat: true,
          hasTypes: true,
        },
        {
          key: "./base",
          sourcePath: "src/presets/base.ts",
          dualFormat: true,
          hasTypes: true,
        },
      ];

      const result = generator.generateExports(exports, DEFAULT_EXPORT_OPTIONS);
      const keys = Object.keys(result);

      expect(keys[0]).toBe(".");
      expect(keys).toContain("./base");
      expect(keys).toContain("./utils/composer");
    });

    test("should handle exports without TypeScript definitions", () => {
      const exports: PackageExport[] = [
        {
          key: ".",
          sourcePath: "src/index.js",
          dualFormat: true,
          hasTypes: false,
        },
      ];

      const result = generator.generateExports(exports, DEFAULT_EXPORT_OPTIONS);

      expect(result).toEqual({
        ".": {
          import: {
            default: "./dist/esm/index.js",
          },
          require: {
            default: "./dist/cjs/index.cjs",
          },
        },
      });
    });
  });

  describe("generateCustomExports", () => {
    test("should apply custom mappings", () => {
      const exports: PackageExport[] = [
        {
          key: "./core/javascript",
          sourcePath: "src/core/javascript.ts",
          dualFormat: true,
          hasTypes: true,
        },
      ];

      const customMappings = {
        "./js": "./core/javascript",
      };

      const result = generator.generateCustomExports(exports, DEFAULT_EXPORT_OPTIONS, customMappings);

      expect(result["./js"]).toEqual(result["./core/javascript"]);
    });

    test("should warn about invalid custom mappings", () => {
      const exports: PackageExport[] = [
        {
          key: "./core/javascript",
          sourcePath: "src/core/javascript.ts",
          dualFormat: true,
          hasTypes: true,
        },
      ];

      const customMappings = {
        "./custom": "./nonexistent",
      };

      generator.generateCustomExports(exports, DEFAULT_EXPORT_OPTIONS, customMappings);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Custom mapping source key "./nonexistent" not found'),
      );
    });
  });

  describe("validateExports", () => {
    test("should validate correct dual format exports", () => {
      const exports = {
        ".": {
          import: {
            default: "./dist/esm/index.js",
            types: "./dist/esm/index.d.ts",
          },
          require: {
            default: "./dist/cjs/index.cjs",
            types: "./dist/cjs/index.d.ts",
          },
        },
      };

      const isValid = generator.validateExports(exports);
      expect(isValid).toBe(true);
    });

    test("should validate simple string exports", () => {
      const exports = {
        ".": "./dist/index.js",
        "./config": "./config.json",
      };

      const isValid = generator.validateExports(exports);
      expect(isValid).toBe(true);
    });

    test("should reject exports without main export", () => {
      const exports = {
        "./utils": "./dist/utils.js",
      };

      const isValid = generator.validateExports(exports);
      expect(isValid).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('Missing main export "."');
    });

    test("should reject invalid export formats", () => {
      const exports = {
        ".": "./dist/index.js",
        "./invalid": { invalid: "format" },
      };

      const isValid = generator.validateExports(exports);
      expect(isValid).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid export format for key "./invalid"'));
    });
  });

  describe("generateSummary", () => {
    test("should generate correct summary", () => {
      const exports = {
        ".": {
          import: { default: "./dist/esm/index.js" },
          require: { default: "./dist/cjs/index.cjs" },
        },
        "./config": "./config.json",
        "./utils": {
          import: { default: "./dist/esm/utils.js" },
          require: { default: "./dist/cjs/utils.cjs" },
        },
      };

      const summary = generator.generateSummary(exports);

      expect(summary).toContain("Generated 3 exports:");
      expect(summary).toContain("2 dual-format (ESM + CJS)");
      expect(summary).toContain("1 simple exports");
    });
  });

  describe("createExportGenerator factory", () => {
    test("should create an export generator instance", () => {
      const generator = createExportGenerator(logger);
      expect(generator).toBeInstanceOf(StandardExportGenerator);
    });
  });
});
