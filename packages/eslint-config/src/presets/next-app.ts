import type { Linter } from "eslint";

import { nextRules } from "@/frameworks/next";
import { reactAppPreset } from "@/presets/react-app";
import { composeConfig } from "@/utils/composer";


// Next.js app preset - configuration for Next.js applications
export const nextAppPreset: Linter.Config[] = composeConfig(reactAppPreset, nextRules);

export default nextAppPreset;
