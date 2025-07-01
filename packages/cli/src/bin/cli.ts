#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

// Import services
import { createGenerateExportsCommand } from "@/commands/generate-exports";
import { createConfigLoader } from "@/services/config-loader";
import { createExportGenerator } from "@/services/export-generator";
import { createFileScanner } from "@/services/file-scanner";
import { createLogger } from "@/services/logger";
import { createPackageManager } from "@/services/package-manager";

import type { GenerateExportsOptions } from "@/types";

// Get package info
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "../../../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

/**
 * Main CLI application
 * Follows the Dependency Injection pattern for better testability
 */
class CLIApplication {
  private readonly program: Command;
  private readonly logger = createLogger();
  private readonly packageManager = createPackageManager(this.logger);
  private readonly fileScanner = createFileScanner(this.logger);
  private readonly exportGenerator = createExportGenerator(this.logger);
  private readonly configLoader = createConfigLoader(this.logger);

  constructor() {
    this.program = new Command();
    this.setupProgram();
    this.setupCommands();
  }

  async run(argv: string[]): Promise<void> {
    try {
      await this.program.parseAsync(argv);
    } catch (error) {
      this.logger.error(`CLI error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }

  private setupProgram(): void {
    this.program
      .name("eslint-sample-cli")
      .description("CLI tool for managing package.json exports in monorepo packages")
      .version(packageJson.version)
      .option("-v, --verbose", "Enable verbose logging")
      .option("--no-color", "Disable colored output")
      .hook("preAction", thisCommand => {
        // Global options handling
        const options = thisCommand.opts();
        if (Boolean(options["noColor"])) {
          process.env["FORCE_COLOR"] = "0";
        }
      });
  }

  private setupCommands(): void {
    this.setupGenerateExportsCommand();
    this.setupListCommand();
    this.setupValidateCommand();
  }

  private setupGenerateExportsCommand(): void {
    const generateCommand = this.program
      .command("generate")
      .alias("gen")
      .description("Generate package.json exports for packages based on source files")
      .option("-p, --package <name>", "Target specific package (name or path)")
      .option("--no-dual-format", "Generate single format exports only")
      .option("-d, --dry-run", "Show what would be generated without writing files")
      .option("-b, --backup", "Create backup before updating package.json")
      .option("-i, --include <patterns...>", "Include patterns for files")
      .option("-e, --exclude <patterns...>", "Exclude patterns for files")
      .option("-m, --mappings <json>", "Custom export mappings as JSON string")
      .option("-c, --config <path>", "Path to exports configuration file")
      .action(async options => {
        try {
          const command = createGenerateExportsCommand(
            this.logger,
            this.fileScanner,
            this.exportGenerator,
            this.packageManager,
            this.configLoader,
          );

          // Parse mappings if provided
          let mappings: Record<string, string> | undefined;
          if (typeof options.mappings === "string" && options.mappings.length > 0) {
            try {
              mappings = JSON.parse(options.mappings);
            } catch (error) {
              this.logger.error(`Invalid mappings JSON: ${error instanceof Error ? error.message : String(error)}`);
              process.exit(1);
            }
          }

          const commandOptions: GenerateExportsOptions = {
            package: options.package,
            dualFormat: options.dualFormat,
            dryRun: options.dryRun,
            backup: options.backup,
            include: options.include,
            exclude: options.exclude,
            mappings,
            config: options.config,
          };

          // Validate options
          command.validateOptions?.(commandOptions);

          await command.execute(commandOptions);
        } catch (error) {
          this.logger.error(`Command failed: ${error instanceof Error ? error.message : String(error)}`);
          process.exit(1);
        }
      });

    // Add examples
    generateCommand.addHelpText(
      "after",
      `
Examples:
  $ eslint-sample-cli generate                    # Generate exports for all packages
  $ eslint-sample-cli gen -p eslint-config       # Generate for specific package
  $ eslint-sample-cli gen --dry-run              # Preview without writing
  $ eslint-sample-cli gen --backup               # Create backup before updating
  $ eslint-sample-cli gen -i "presets/*"         # Include only preset files
  $ eslint-sample-cli gen -e "test/*"            # Exclude test files
  $ eslint-sample-cli gen -m '{"./custom":"./src/custom"}' # Custom mappings
    `,
    );
  }

  private setupListCommand(): void {
    this.program
      .command("list")
      .alias("ls")
      .description("List packages and their current exports")
      .option("-p, --package <name>", "Target specific package")
      .option("--json", "Output as JSON")
      .action(async _options => {
        try {
          this.logger.info("Listing packages and exports...");

          // This would be implemented as a separate command class
          // For now, just show a placeholder
          this.logger.warn("List command not yet implemented");
        } catch (error) {
          this.logger.error(`List command failed: ${error instanceof Error ? error.message : String(error)}`);
          process.exit(1);
        }
      });
  }

  private setupValidateCommand(): void {
    this.program
      .command("validate")
      .description("Validate package.json exports configuration")
      .option("-p, --package <name>", "Target specific package")
      .option("--fix", "Attempt to fix validation issues")
      .action(async _options => {
        try {
          this.logger.info("Validating package exports...");

          // This would be implemented as a separate command class
          // For now, just show a placeholder
          this.logger.warn("Validate command not yet implemented");
        } catch (error) {
          this.logger.error(`Validate command failed: ${error instanceof Error ? error.message : String(error)}`);
          process.exit(1);
        }
      });
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const cli = new CLIApplication();
  await cli.run(process.argv);
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", error => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Run the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { CLIApplication };
