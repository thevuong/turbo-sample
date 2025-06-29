import type { Linter } from "eslint";

// Configuration composition utilities
export function composeConfig(...configs: Linter.Config[][]): Linter.Config[] {
  return configs.flat();
}

export interface ConfigOptions {
  base?: boolean;
  typescript?: boolean;
  react?: boolean;
  next?: boolean;
  environments?: ('node' | 'browser')[];
  languages?: ('json' | 'markdown' | 'css')[];
  strictness?: 'standard' | 'strict' | 'relaxed';
}

export async function createCustomConfig(options: ConfigOptions): Promise<Linter.Config[]> {
  const {
    base = true,
    typescript = true,
    react = false,
    next = false,
    environments = ['node'],
    languages = ['json', 'markdown', 'css'],
    strictness = 'standard'
  } = options;

  const configs: Linter.Config[][] = [];

  // Load base configuration
  if (base) {
    const { baseJavaScriptRules } = await import('../core/base');
    configs.push(baseJavaScriptRules);
  }

  // Load TypeScript configuration
  if (typescript) {
    const { typescriptRules } = await import('../core/typescript');
    configs.push(typescriptRules);
  }

  // Load environment configurations
  for (const env of environments) {
    if (env === 'node') {
      const { nodeEnvironment } = await import('../environments/node');
      configs.push(nodeEnvironment);
    } else if (env === 'browser') {
      const { browserEnvironment } = await import('../environments/browser');
      configs.push(browserEnvironment);
    }
  }

  // Load language configurations
  for (const lang of languages) {
    if (lang === 'json') {
      const { jsonRules } = await import('../languages/json');
      configs.push(jsonRules);
    } else if (lang === 'markdown') {
      const { markdownRules } = await import('../languages/markdown');
      configs.push(markdownRules);
    } else if (lang === 'css') {
      const { cssRules } = await import('../languages/css');
      configs.push(cssRules);
    }
  }

  // Load framework configurations
  if (react) {
    const { reactRules } = await import('../frameworks/react');
    configs.push(reactRules);
  }

  if (next) {
    const { nextRules } = await import('../frameworks/next');
    configs.push(nextRules);
  }

  // Apply strictness modifications
  if (strictness === 'strict') {
    configs.push([{
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      rules: {
        "no-console": "warn",
        "@typescript-eslint/explicit-function-return-type": "warn"
      }
    }]);
  } else if (strictness === 'relaxed') {
    configs.push([{
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-unused-vars": "off"
      }
    }]);
  }

  return composeConfig(...configs);
}

export default { composeConfig, createCustomConfig };