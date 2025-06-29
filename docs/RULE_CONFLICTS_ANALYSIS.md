# Phân tích xung đột rules trong ESLint Config

## Tổng quan

Sau khi đánh giá toàn bộ các rules trong `packages/eslint-config/src`, đây là báo cáo chi tiết về các xung đột tiềm ẩn và khuyến nghị ưu tiên.

## Các xung đột đã phát hiện

### 1. Xung đột về unused variables

**Vị trí xung đột:**

- `core/base.ts`: `"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]`
- `core/typescript.ts`: `"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]`

**Phân tích:**

- Đây là xung đột giữa rule JavaScript gốc và rule TypeScript tương ứng
- Cả hai rule có cùng cấu hình và mức độ nghiêm trọng

**Khuyến nghị:** ✅ **KHÔNG CẦN SỬA** - TypeScript rule sẽ tự động override JavaScript rule cho file TypeScript

### 2. Xung đột về duplicate imports

**Vị trí xung đột:**

- `core/base.ts`: `"no-duplicate-imports": "error"`
- `core/import.ts`: `"import/no-duplicates": "error"`

**Phân tích:**

- Rule gốc của ESLint vs rule từ eslint-plugin-import
- Cả hai đều phát hiện import trùng lặp nhưng có cách xử lý khác nhau

**Khuyến nghị:** ✅ **ƯU TIÊN `import/no-duplicates`** - Rule này mạnh mẽ hơn và có thể merge imports

### 3. Xung đột về string methods

**Vị trí xung đột:**

- `core/unicorn.ts`: `"unicorn/prefer-includes": "error"` và `"unicorn/prefer-string-starts-ends-with": "error"`
- `core/typescript.ts`: `"@typescript-eslint/prefer-includes": "error"` và `"@typescript-eslint/prefer-string-starts-ends-with": "error"`

**Phân tích:**

- Cả hai plugin đều có rules tương tự cho việc sử dụng methods hiện đại
- TypeScript rules có type-awareness tốt hơn

**Khuyến nghị:** ✅ **ƯU TIÊN TypeScript rules** - Tắt unicorn rules tương ứng cho file TypeScript

### 4. Xung đột về React import

**Vị trí xung đột:**

- `frameworks/react.ts`: `"react/react-in-jsx-scope": "off"`
- `frameworks/next.ts`: `"react/react-in-jsx-scope": "off"`

**Phân tích:**

- Cả hai đều tắt rule này (phù hợp với React 17+)
- Không phải xung đột thực sự, chỉ là redundant

**Khuyến nghị:** ✅ **KHÔNG CẦN SỬA** - Redundancy này không gây hại

### 5. Xung đột về function return types

**Vị trí xung đột:**

- `core/typescript.ts`: `"@typescript-eslint/explicit-function-return-type": "off"`
- `presets/library.ts`: `"@typescript-eslint/explicit-function-return-type": "warn"`

**Phân tích:**

- Core config tắt rule này để linh hoạt hơn
- Library preset bật lại để đảm bảo type safety cho thư viện

**Khuyến nghị:** ✅ **THIẾT KẾ ĐÚNG** - Library cần strict hơn, app có thể linh hoạt hơn

### 6. Xung đột về console usage

**Vị trí xung đột:**

- `core/base.ts`: `"no-console": "warn"`
- `presets/library.ts`: `"no-console": "warn"`

**Phân tích:**

- Cả hai đều set cùng mức độ
- Redundant nhưng không gây xung đột

**Khuyến nghị:** ✅ **KHÔNG CẦN SỬA** - Consistency tốt

## Các vấn đề thiết kế khác

### 1. Prettier integration

**Vấn đề:** `presets/react-app.ts` không include `prettierRules` trong khi `presets/base.ts` có

**Khuyến nghị:** ⚠️ **CẦN SỬA** - Thêm prettier vào react-app preset

### 2. Environment consistency

**Vấn đề:**

- `base.ts` sử dụng `nodeEnvironment`
- `react-app.ts` sử dụng `browserEnvironment`

**Khuyến nghị:** ✅ **THIẾT KẾ ĐÚNG** - Phù hợp với từng loại project

## Khuyến nghị ưu tiên xử lý xung đột

### Thứ tự ưu tiên (từ cao đến thấp):

1. **TypeScript rules > JavaScript rules** (cho file .ts/.tsx)
2. **Framework-specific rules > Generic rules** (cho file framework)
3. **Preset-specific rules > Core rules** (library preset strict hơn base)
4. **Plugin-specific rules > Built-in rules** (khi plugin rules mạnh mẽ hơn)
5. **Prettier rules > Formatting rules** (luôn để cuối để disable conflicts)

### Cấu trúc composition được khuyến nghị:

```typescript
// Thứ tự trong preset
composeConfig(
  baseJavaScriptRules, // 1. Foundation
  typescriptRules, // 2. Language-specific
  securityRules, // 3. Security
  unicornRules, // 4. Best practices
  importRules, // 5. Import management
  environmentRules, // 6. Environment
  frameworkRules, // 7. Framework-specific
  testingRules, // 8. Testing (if applicable)
  presetSpecificRules, // 9. Preset overrides
  prettierRules, // 10. Formatting (always last)
);
```

## Kết luận

Nhìn chung, ESLint config này được thiết kế khá tốt với ít xung đột thực sự. Các "xung đột" chủ yếu là:

1. **Intentional overrides** - TypeScript rules override JavaScript rules (đúng thiết kế)
2. **Preset specialization** - Library preset strict hơn base preset (đúng thiết kế)
3. **Plugin redundancy** - Một số rules tương tự từ các plugin khác nhau (có thể optimize)

**Khuyến nghị chính:** Chỉ cần sửa việc thiếu prettier trong react-app preset, các xung đột khác đều là thiết kế hợp lý.
