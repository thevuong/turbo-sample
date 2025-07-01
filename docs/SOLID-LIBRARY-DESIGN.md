# Tài liệu: Viết thư viện trong packages theo nguyên tắc SOLID

## Giới thiệu

Tài liệu này hướng dẫn cách thiết kế và phát triển thư viện trong monorepo packages theo các nguyên tắc SOLID, dựa trên
kinh nghiệm thực tế từ dự án ESLint Sample Monorepo.

## Nguyên tắc SOLID trong thiết kế thư viện

### 1. Single Responsibility Principle (SRP) - Nguyên tắc Trách nhiệm Đơn

**Định nghĩa**: Mỗi class/module chỉ nên có một lý do để thay đổi.

#### Ví dụ thực tế từ CLI package:

```typescript
// ❌ Vi phạm SRP - class làm quá nhiều việc
class BadPackageHandler {
  readPackageJson() {
    /* ... */
  }

  writePackageJson() {
    /* ... */
  }

  validatePackageJson() {
    /* ... */
  }

  logMessages() {
    /* ... */
  }

  scanFiles() {
    /* ... */
  }
}

// ✅ Tuân thủ SRP - mỗi class có một trách nhiệm rõ ràng
class FileSystemPackageManager implements PackageManager {
  // Chỉ xử lý các thao tác với package.json
  async readPackageJson(packagePath: string): Promise<PackageJson> {
    /* ... */
  }

  async updatePackageJson(packagePath: string, exports: Record<string, unknown>): Promise<void> {
    /* ... */
  }

  async backupPackageJson(packagePath: string): Promise<string> {
    /* ... */
  }
}

class FileScanner implements FileScanner {
  // Chỉ xử lý việc quét và phân tích files
  async scanPackage(packagePath: string): Promise<PackageExport[]> {
    /* ... */
  }

  filterExports(exports: PackageExport[], includePatterns?: string[]): PackageExport[] {
    /* ... */
  }
}
```

#### Cấu trúc thư mục theo SRP:

```
src/
├── services/
│   ├── package-manager.ts    # Chỉ xử lý package.json
│   ├── file-scanner.ts       # Chỉ quét files
│   ├── export-generator.ts   # Chỉ tạo exports
│   ├── config-loader.ts      # Chỉ load config
│   └── logger.ts            # Chỉ xử lý logging
├── commands/                # Chỉ xử lý CLI commands
├── schemas/                 # Chỉ validation schemas
└── types/                   # Chỉ type definitions
```

### 2. Open/Closed Principle (OCP) - Nguyên tắc Mở/Đóng

**Định nghĩa**: Các module nên mở cho việc mở rộng nhưng đóng cho việc sửa đổi.

#### Ví dụ từ ESLint Config package:

```typescript
// ✅ Thiết kế mở rộng được - không cần sửa code cũ
// packages/eslint-config/src/core/javascript.ts
export const baseJavaScriptRules: Linter.Config[] = [
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      // Base rules
    },
  },
];

// packages/eslint-config/src/core/typescript.ts
export const typescriptRules: Linter.Config[] = [
  ...baseJavaScriptRules, // Mở rộng từ base rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript specific rules
    },
  },
];

// packages/eslint-config/src/frameworks/react.ts
export const reactRules: Linter.Config[] = [
  ...typescriptRules, // Mở rộng từ TypeScript rules
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      // React specific rules
    },
  },
];
```

#### Cấu trúc modular cho OCP:

```
src/
├── core/           # Base configurations
├── environments/   # Environment-specific extensions
├── frameworks/     # Framework-specific extensions
├── languages/      # Language-specific extensions
└── presets/        # Pre-configured combinations
```

### 3. Liskov Substitution Principle (LSP) - Nguyên tắc Thay thế Liskov

**Định nghĩa**: Các đối tượng của class con phải có thể thay thế được các đối tượng của class cha.

#### Ví dụ từ CLI package:

```typescript
// Interface base
interface Logger {
  info(message: string): void;

  success(message: string): void;

  warn(message: string): void;

  error(message: string): void;
}

// ✅ Implementation tuân thủ LSP
class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`ℹ ${message}`);
  }

  success(message: string): void {
    console.log(`✅ ${message}`);
  }

  warn(message: string): void {
    console.warn(`⚠️ ${message}`);
  }

  error(message: string): void {
    console.error(`❌ ${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private logFile: string) {}

  info(message: string): void {
    this.writeToFile(`INFO: ${message}`);
  }

  success(message: string): void {
    this.writeToFile(`SUCCESS: ${message}`);
  }

  warn(message: string): void {
    this.writeToFile(`WARN: ${message}`);
  }

  error(message: string): void {
    this.writeToFile(`ERROR: ${message}`);
  }

  private writeToFile(message: string): void {
    // Implementation
  }
}

// ✅ Có thể thay thế được nhau
function processPackage(logger: Logger) {
  logger.info("Processing package..."); // Hoạt động với cả hai implementation
}

processPackage(new ConsoleLogger());
processPackage(new FileLogger("app.log"));
```

### 4. Interface Segregation Principle (ISP) - Nguyên tắc Phân tách Interface

**Định nghĩa**: Không nên ép client phụ thuộc vào các interface mà chúng không sử dụng.

#### Ví dụ từ CLI package:

```typescript
// ❌ Vi phạm ISP - interface quá lớn
interface BadServiceInterface {
  readPackageJson(): Promise<PackageJson>;

  writePackageJson(): Promise<void>;

  scanFiles(): Promise<string[]>;

  generateExports(): Record<string, unknown>;

  logMessage(): void;

  validateConfig(): boolean;
}

// ✅ Tuân thủ ISP - interfaces nhỏ và tập trung
interface PackageManager {
  readPackageJson(packagePath: string): Promise<PackageJson>;

  updatePackageJson(packagePath: string, exports: Record<string, unknown>): Promise<void>;

  backupPackageJson(packagePath: string): Promise<string>;
}

interface FileScanner {
  scanPackage(packagePath: string): Promise<PackageExport[]>;

  filterExports(exports: PackageExport[], patterns?: string[]): PackageExport[];
}

interface ExportGenerator {
  generateExports(exports: PackageExport[], options: ExportGeneratorOptions): Record<string, unknown>;

  validateExports(exports: Record<string, unknown>): boolean;
}

interface Logger {
  info(message: string): void;

  success(message: string): void;

  warn(message: string): void;

  error(message: string): void;
}

// ✅ Client chỉ phụ thuộc vào interface cần thiết
class PackageProcessor {
  constructor(
    private packageManager: PackageManager, // Chỉ cần PackageManager
    private logger: Logger, // Chỉ cần Logger
  ) {}

  async process(packagePath: string): Promise<void> {
    const packageJson = await this.packageManager.readPackageJson(packagePath);
    this.logger.info(`Processing ${packageJson.name}`);
  }
}
```

### 5. Dependency Inversion Principle (DIP) - Nguyên tắc Đảo ngược Phụ thuộc

**Định nghĩa**: Các module cấp cao không nên phụ thuộc vào các module cấp thấp. Cả hai nên phụ thuộc vào abstractions.

#### Ví dụ từ CLI package:

```typescript
// ❌ Vi phạm DIP - phụ thuộc vào concrete class
class BadExportCommand {
  private packageManager = new FileSystemPackageManager(); // Concrete dependency
  private logger = new ConsoleLogger(); // Concrete dependency

  async execute(): Promise<void> {
    // Implementation
  }
}

// ✅ Tuân thủ DIP - phụ thuộc vào abstractions
class GenerateExportsCommand implements CLICommand<GenerateExportsOptions> {
  constructor(
    private packageManager: PackageManager, // Abstract dependency
    private fileScanner: FileScanner, // Abstract dependency
    private exportGenerator: ExportGenerator, // Abstract dependency
    private logger: Logger, // Abstract dependency
  ) {}

  async execute(options: GenerateExportsOptions): Promise<void> {
    // Implementation using abstractions
  }
}

// ✅ Factory pattern để inject dependencies
export function createGenerateExportsCommand(logger: Logger): CLICommand<GenerateExportsOptions> {
  return new GenerateExportsCommand(
    createPackageManager(logger),
    createFileScanner(logger),
    createExportGenerator(logger),
    logger,
  );
}
```

## Cấu trúc Package theo SOLID

### 1. Cấu trúc thư mục chuẩn

```
packages/your-library/
├── src/
│   ├── core/           # Core business logic
│   ├── services/       # Service implementations
│   ├── interfaces/     # Abstract interfaces
│   ├── types/          # Type definitions
│   ├── utils/          # Utility functions
│   ├── factories/      # Factory functions
│   └── index.ts        # Main exports
├── tests/              # Test files
├── dist/               # Build output
├── package.json
├── tsconfig.json
└── README.md
```

### 2. Patterns thiết kế thường dùng

#### Factory Pattern

```typescript
// factories/logger-factory.ts
export function createLogger(type: "console" | "file", options?: LoggerOptions): Logger {
  switch (type) {
    case "console":
      return new ConsoleLogger(options);
    case "file":
      return new FileLogger(options);
    default:
      throw new Error(`Unknown logger type: ${type}`);
  }
}
```

#### Dependency Injection

```typescript
// services/package-processor.ts
export class PackageProcessor {
  constructor(
    private readonly packageManager: PackageManager,
    private readonly fileScanner: FileScanner,
    private readonly logger: Logger,
  ) {}

  async process(packagePath: string): Promise<void> {
    // Implementation
  }
}

// factories/package-processor-factory.ts
export function createPackageProcessor(logger: Logger): PackageProcessor {
  return new PackageProcessor(createPackageManager(logger), createFileScanner(logger), logger);
}
```

#### Strategy Pattern

```typescript
// interfaces/export-strategy.ts
interface ExportStrategy {
  generate(exports: PackageExport[], options: ExportGeneratorOptions): Record<string, unknown>;
}

// strategies/dual-format-strategy.ts
export class DualFormatStrategy implements ExportStrategy {
  generate(exports: PackageExport[], options: ExportGeneratorOptions): Record<string, unknown> {
    // Generate both ESM and CJS exports
  }
}

// strategies/esm-only-strategy.ts
export class ESMOnlyStrategy implements ExportStrategy {
  generate(exports: PackageExport[], options: ExportGeneratorOptions): Record<string, unknown> {
    // Generate ESM exports only
  }
}
```

### 3. Export Strategy cho thư viện

#### Atomic Exports (Tree-shaking friendly)

```typescript
// src/index.ts - Main entry point
// Core exports
export { baseJavaScriptRules } from "./core/javascript";
export { typescriptRules } from "./core/typescript";

// Environment exports
export { nodeEnvironment } from "./environments/node";
export { browserEnvironment } from "./environments/browser";

// Framework exports
export { reactRules } from "./frameworks/react";
export { nextRules } from "./frameworks/next";

// Preset exports (convenience)
export { basePreset } from "./presets/base-preset";
export { libraryPreset } from "./presets/library";

// Utility exports
export { composeConfig } from "./utils/composer";
```

#### Package.json exports configuration

```json
{
  "name": "@your-org/your-library",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.cjs",
      "types": "./dist/esm/index.d.ts"
    },
    "./core": {
      "import": "./dist/esm/core/index.js",
      "require": "./dist/cjs/core/index.cjs",
      "types": "./dist/esm/core/index.d.ts"
    },
    "./utils": {
      "import": "./dist/esm/utils/index.js",
      "require": "./dist/cjs/utils/index.cjs",
      "types": "./dist/esm/utils/index.d.ts"
    }
  }
}
```

## Best Practices

### 1. Type Safety

```typescript
// Sử dụng strict TypeScript configuration
// tsconfig.json
{
  "compilerOptions"
:
  {
    "strict"
  :
    true,
      "noImplicitAny"
  :
    true,
      "noImplicitReturns"
  :
    true,
      "noUnusedLocals"
  :
    true,
      "noUnusedParameters"
  :
    true
  }
}

// Định nghĩa types rõ ràng
export interface PackageExport {
  readonly name: string;
  readonly path: string;
  readonly type: 'file' | 'directory';
  readonly category?: string;
}
```

### 2. Error Handling

```typescript
// Custom error types
export class PackageNotFoundError extends Error {
  constructor(packagePath: string) {
    super(`Package not found at ${packagePath}`);
    this.name = "PackageNotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Proper error handling in services
export class FileSystemPackageManager implements PackageManager {
  async readPackageJson(packagePath: string): Promise<PackageJson> {
    try {
      const packageJson = await readJson(packageJsonPath);
      return packageJsonSchema.parse(packageJson);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Invalid package.json",
          error.errors.map(e => e.message),
        );
      }
      throw new PackageNotFoundError(packagePath);
    }
  }
}
```

### 3. Testing Strategy

```typescript
// tests/services/package-manager.test.ts
import { describe, test, expect, beforeEach } from "@jest/globals";
import { FileSystemPackageManager } from "../../src/services/package-manager";
import { MockLogger } from "../mocks/logger";

describe("FileSystemPackageManager", () => {
  let packageManager: FileSystemPackageManager;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = new MockLogger();
    packageManager = new FileSystemPackageManager(mockLogger);
  });

  test("should read valid package.json", async () => {
    // Test implementation
  });

  test("should throw error for invalid package.json", async () => {
    // Test implementation
  });
});
```

### 4. Documentation

````typescript
/**
 * Package manager service for handling package.json operations
 *
 * @example
 * ```typescript
 * const logger = createLogger('console');
 * const packageManager = createPackageManager(logger);
 * const packageJson = await packageManager.readPackageJson('./my-package');
 * ```
 */
export class FileSystemPackageManager implements PackageManager {
  /**
   * Read and validate package.json from a directory
   *
   * @param packagePath - Absolute path to the package directory
   * @returns Promise resolving to validated PackageJson object
   * @throws {PackageNotFoundError} When package.json doesn't exist
   * @throws {ValidationError} When package.json is invalid
   */
  async readPackageJson(packagePath: string): Promise<PackageJson> {
    // Implementation
  }
}
````

## Kết luận

Việc áp dụng nguyên tắc SOLID trong thiết kế thư viện packages mang lại nhiều lợi ích:

1. **Maintainability**: Code dễ bảo trì và mở rộng
2. **Testability**: Dễ dàng viết unit tests
3. **Reusability**: Components có thể tái sử dụng
4. **Flexibility**: Dễ dàng thay đổi implementation
5. **Scalability**: Dự án có thể mở rộng quy mô

Bằng cách tuân thủ các nguyên tắc này, bạn có thể tạo ra những thư viện chất lượng cao, dễ sử dụng và bảo trì trong môi
trường monorepo.
