# Modern Code Style Guide

## Tổng quan

Dự án này đã có nền tảng tốt với các công cụ hiện đại, nhưng có thể cải thiện thêm để áp dụng các phong cách code hiện đại nhất.

## 1. TypeScript Modern Practices

### Cải thiện tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules", "dist", "build", "coverage"]
}
```

### Modern TypeScript Patterns

- Sử dụng `const assertions` và `satisfies` operator
- Áp dụng `branded types` cho type safety
- Sử dụng `template literal types` cho string validation
- Áp dụng `conditional types` và `mapped types`

## 2. ESLint Modern Rules

### Cải thiện Base JavaScript Rules

```typescript
export const modernBaseRules: Linter.Config[] = [
  {
    ignores: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/coverage/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
      // Modern JavaScript practices
      "prefer-const": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "prefer-destructuring": ["error", { object: true, array: false }],
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "object-shorthand": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-useless-rename": "error",
      "no-duplicate-imports": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "consistent-return": "error",
      "default-case-last": "error",
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "error",
      "no-magic-numbers": ["warn", { ignore: [0, 1, -1] }],
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-numeric-literals": "error",
      "prefer-object-spread": "error",
      radix: "error",
      yoda: "error",
    },
  },
];
```

### Cải thiện TypeScript Rules

```typescript
export const modernTypescriptRules: Linter.Config[] = [
  ...(tseslint.configs.recommended as Linter.Config[]),
  ...(tseslint.configs.stylistic as Linter.Config[]),
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      // Type-aware modern rules
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-readonly-parameter-types": "warn",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-literal-enum-member": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-return-this-type": "error",
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/unbound-method": "error",
    },
  },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    rules: {
      // Style and consistency rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-meaningless-void-operator": "error",
      "@typescript-eslint/no-mixed-enums": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unnecessary-type-arguments": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/non-nullable-type-assertion-style": "error",
    },
  },
];
```

## 3. Modern Project Structure

### Recommended Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── feature/        # Feature-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   ├── types.ts        # Type definitions
│   ├── constants.ts    # Application constants
│   └── helpers.ts      # Helper functions
├── services/           # API and external services
├── stores/             # State management
├── styles/             # Global styles
└── __tests__/          # Test files
```

## 4. Modern Coding Patterns

### Function Declarations

```typescript
// ✅ Modern: Arrow functions with explicit types
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ✅ Modern: Function expressions for complex logic
const processUserData = async (userId: string): Promise<UserData> => {
  const user = await fetchUser(userId);
  return transformUserData(user);
};
```

### Type Definitions

```typescript
// ✅ Modern: Interface over type for object shapes
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Modern: Branded types for type safety
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

// ✅ Modern: Template literal types
type EventName = `on${Capitalize<string>}`;
```

### Error Handling

```typescript
// ✅ Modern: Result pattern
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

const fetchUserSafely = async (id: string): Promise<Result<User>> => {
  try {
    const user = await fetchUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

### Async/Await Patterns

```typescript
// ✅ Modern: Proper async/await with error handling
const processMultipleUsers = async (userIds: string[]): Promise<User[]> => {
  const results = await Promise.allSettled(userIds.map(id => fetchUser(id)));

  return results
    .filter((result): result is PromiseFulfilledResult<User> => result.status === "fulfilled")
    .map(result => result.value);
};
```

## 5. Modern Testing Practices

### Test Structure

```typescript
// ✅ Modern: Descriptive test names and proper setup
describe("UserService", () => {
  describe("when fetching user data", () => {
    it("should return user data for valid ID", async () => {
      // Arrange
      const userId = "user-123";
      const expectedUser = { id: userId, name: "John Doe" };

      // Act
      const result = await userService.getUser(userId);

      // Assert
      expect(result).toEqual(expectedUser);
    });
  });
});
```

## 6. Performance Optimizations

### Bundle Optimization

- Sử dụng dynamic imports cho code splitting
- Tree shaking với proper ES modules
- Lazy loading cho components

### Memory Management

- Cleanup effects trong React hooks
- Proper event listener removal
- Avoid memory leaks với WeakMap/WeakSet

## 7. Security Best Practices

### Input Validation

```typescript
// ✅ Modern: Runtime type validation
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

type User = z.infer<typeof UserSchema>;
```

### Sanitization

- XSS protection
- SQL injection prevention
- CSRF protection

## 8. Documentation Standards

### JSDoc Comments

````typescript
/**
 * Calculates the total price including tax
 * @param items - Array of items to calculate total for
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price including tax
 * @throws {Error} When tax rate is negative
 * @example
 * ```typescript
 * const total = calculateTotalWithTax([{price: 100}], 0.1);
 * console.log(total); // 110
 * ```
 */
const calculateTotalWithTax = (items: Item[], taxRate: number): number => {
  if (taxRate < 0) throw new Error("Tax rate cannot be negative");
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
};
````

## 9. Git Workflow Modern Practices

### Commit Messages

- Sử dụng conventional commits
- Descriptive commit messages
- Atomic commits

### Branch Strategy

- Feature branches
- Pull request reviews
- Automated testing

## 10. Monitoring và Logging

### Error Tracking

```typescript
// ✅ Modern: Structured logging
const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: "info", message, meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, meta?: Record<string, unknown>) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
```

## Kết luận

Việc áp dụng các phong cách code hiện đại này sẽ giúp:

- Tăng tính bảo trì của code
- Giảm bugs và lỗi runtime
- Cải thiện performance
- Tăng developer experience
- Đảm bảo consistency trong team

Nên triển khai từng phần một cách có kế hoạch để tránh breaking changes lớn.
