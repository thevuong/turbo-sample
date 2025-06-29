// New atomic exports for better tree shaking
// Note: These imports are mapped to the flat build output structure
export { baseJavaScriptRules } from '@/core/base';
export { typescriptRules } from '@/core/typescript';
export { nodeEnvironment } from '@/environments/node';
export { browserEnvironment } from '@/environments/browser';
export { jsonRules } from '@/languages/json';
export { markdownRules } from '@/languages/markdown';
export { cssRules } from '@/languages/css';
export { reactRules } from '@/frameworks/react';
export { nextRules } from '@/frameworks/next';
export { onlyWarnRules } from '@/utils/only-warn';
export { prettierRules } from '@/utils/prettier';
export { turboRules } from '@/utils/turbo';

// Preset exports
export { basePreset } from '@/presets/base';
export { libraryPreset } from '@/presets/library';
export { reactAppPreset } from '@/presets/react-app';
export { nextAppPreset } from '@/presets/next-app';

// Utility exports
export { composeConfig, createCustomConfig } from '@/utils/composer';
export type { ConfigOptions } from '@/utils/composer';

// Backward compatibility exports
export { basePreset as baseConfig } from '@/presets/base';
export { reactAppPreset as reactConfig } from '@/presets/react-app';
export { nextAppPreset as nextConfig } from '@/presets/next-app';
export { libraryPreset as libraryConfig } from '@/presets/library';

// Default export is the base preset
export { basePreset as default } from '@/presets/base';
