import { composeConfig, libraryPreset } from "@eslint-sample/eslint-config";

export default composeConfig(libraryPreset, [
  {
    rules: {
      "no-console": "off",
    },
  },
]);
