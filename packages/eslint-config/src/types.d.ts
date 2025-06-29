declare module '@next/eslint-plugin-next' {
  import type { Linter, ESLint } from 'eslint';

  interface NextESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
      'core-web-vitals': Linter.Config;
    };
  }

  const plugin: NextESLintPlugin;
  export default plugin;
}

declare module 'eslint-plugin-only-warn' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-config-prettier' {
  import type { Linter } from 'eslint';

  const config: Linter.Config;
  export default config;
}

declare module 'eslint-plugin-turbo' {
  import type { Linter, ESLint } from 'eslint';

  interface TurboESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: TurboESLintPlugin;
  export default plugin;
}
