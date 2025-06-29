import { reactAppPreset } from '@/presets/react-app';
import { nextRules } from '@/frameworks/next';
import { composeConfig } from '@/utils/composer';
import type { Linter } from "eslint";

// Next.js app preset - configuration for Next.js applications
export const nextAppPreset: Linter.Config[] = composeConfig(
  reactAppPreset,
  nextRules
);

export default nextAppPreset;