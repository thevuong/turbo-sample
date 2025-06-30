import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";

import { ConsoleLogger, createLogger } from "@/services/logger";

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {
  // Intentionally empty for testing
});

describe("Logger Service", () => {
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger();
    mockConsoleLog.mockClear();
  });

  afterEach(() => {
    // Stop any active spinners
    logger.stopSpinner();
  });

  describe("ConsoleLogger", () => {
    test("should log info messages with blue icon", () => {
      logger.info("Test info message");

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("ℹ"), "Test info message");
    });

    test("should log success messages with green icon", () => {
      logger.success("Test success message");

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("✓"), "Test success message");
    });

    test("should log warning messages with yellow icon", () => {
      logger.warn("Test warning message");

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("⚠"), "Test warning message");
    });

    test("should log error messages with red icon", () => {
      logger.error("Test error message");

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("✗"), "Test error message");
    });

    test("should handle spinner operations", () => {
      // Start spinner
      logger.startSpinner("Loading...");
      expect(logger["spinner"]).toBeTruthy();

      // Stop spinner with success
      logger.stopSpinner("Done!");
      expect(logger["spinner"]).toBeNull();
    });

    test("should handle spinner failure", () => {
      logger.startSpinner("Processing...");
      expect(logger["spinner"]).toBeTruthy();

      logger.failSpinner("Failed!");
      expect(logger["spinner"]).toBeNull();
    });

    test("should handle multiple spinners correctly", () => {
      logger.startSpinner("First spinner");
      const firstSpinner = logger["spinner"];

      logger.startSpinner("Second spinner");
      const secondSpinner = logger["spinner"];

      expect(firstSpinner).not.toBe(secondSpinner);
      expect(logger["spinner"]).toBe(secondSpinner);
    });

    test("should handle logging while spinner is active", () => {
      logger.startSpinner("Processing...");
      logger.info("Info during spinner");

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("ℹ"), "Info during spinner");
    });
  });

  describe("createLogger factory", () => {
    test("should create a logger instance", () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(ConsoleLogger);
    });

    test("should create different instances", () => {
      const logger1 = createLogger();
      const logger2 = createLogger();
      expect(logger1).not.toBe(logger2);
    });
  });
});
