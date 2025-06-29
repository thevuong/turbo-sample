import { describe, test, expect } from "@jest/globals";

describe("ESLint Config Package", () => {
  test("should be able to run TypeScript tests with Jest and @swc/jest", () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  test("should support ES modules syntax", () => {
    const testObject = { name: "test", value: 42 };
    expect(testObject).toEqual({ name: "test", value: 42 });
  });
});
