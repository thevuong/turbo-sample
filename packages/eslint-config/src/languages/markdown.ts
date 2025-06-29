import markdown from "@eslint/markdown";
import type { Linter } from "eslint";

// Markdown file configuration
export const markdownRules: Linter.Config[] = [
  {
    files: ["**/*.md"],
    plugins: { markdown } as any,
    language: "markdown/gfm",
    rules: {
      ...(markdown.configs.recommended[0]?.rules || {}),
    },
  },
];

export default markdownRules;
