import chalk from "chalk";
import ora, { type Ora } from "ora";

import type { Logger } from "@/types";

/**
 * Logger service implementation using chalk for colors and ora for spinners
 * Follows the Single Responsibility Principle by handling only logging concerns
 */
export class ConsoleLogger implements Logger {
  private spinner: Ora | null = null;

  info(message: string): void {
    this.log(chalk.blue("ℹ"), message);
  }

  success(message: string): void {
    this.log(chalk.green("✓"), message);
  }

  warn(message: string): void {
    this.log(chalk.yellow("⚠"), message);
  }

  error(message: string): void {
    this.log(chalk.red("✗"), message);
  }

  startSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.stop();
    }
    this.spinner = ora({
      text: message,
      color: "blue",
    }).start();
  }

  stopSpinner(message?: string): void {
    if (this.spinner) {
      if (message !== undefined && message !== "") {
        this.spinner.succeed(message);
      } else {
        this.spinner.stop();
      }
      this.spinner = null;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      if (message !== undefined && message !== "") {
        this.spinner.fail(message);
      } else {
        this.spinner.fail();
      }
      this.spinner = null;
    }
  }

  private log(prefix: string, message: string): void {
    // Stop spinner if active to avoid conflicts
    if (this.spinner) {
      this.spinner.stop();
      // eslint-disable-next-line no-console
      console.log(prefix, message);
      this.spinner.start();
    } else {
      // eslint-disable-next-line no-console
      console.log(prefix, message);
    }
  }
}

/**
 * Factory function to create a logger instance
 * Follows the Dependency Inversion Principle by returning the interface
 */
export function createLogger(): Logger {
  return new ConsoleLogger();
}
