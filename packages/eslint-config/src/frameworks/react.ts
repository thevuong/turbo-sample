import pluginReact from "eslint-plugin-react";
import type { Linter } from "eslint";

// React framework configuration
export const reactRules: Linter.Config[] = [
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in modern React
      "react/prop-types": "off" // TypeScript handles prop validation
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];

export default reactRules;