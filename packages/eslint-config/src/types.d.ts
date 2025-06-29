declare module "@next/eslint-plugin-next" {
  import type { Linter, ESLint } from "eslint";

  interface NextESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
      "core-web-vitals": Linter.Config;
    };
  }

  const plugin: NextESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-only-warn" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module "eslint-config-prettier" {
  import type { Linter } from "eslint";

  const config: Linter.Config;
  export default config;
}

declare module "eslint-plugin-turbo" {
  import type { Linter, ESLint } from "eslint";

  interface TurboESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: TurboESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-security" {
  import type { Linter, ESLint } from "eslint";

  interface SecurityESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: SecurityESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-sonarjs" {
  import type { Linter, ESLint } from "eslint";

  interface SonarjsESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: SonarjsESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-unicorn" {
  import type { Linter, ESLint } from "eslint";

  interface UnicornESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: UnicornESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-import" {
  import type { Linter, ESLint } from "eslint";

  interface ImportESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
      typescript: Linter.Config;
    };
  }

  const plugin: ImportESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-jest" {
  import type { Linter, ESLint } from "eslint";

  interface JestESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: JestESLintPlugin;
  export default plugin;
}

declare module "eslint-plugin-jsx-a11y" {
  import type { Linter, ESLint } from "eslint";

  interface JsxA11yESLintPlugin extends ESLint.Plugin {
    configs: {
      recommended: Linter.Config;
    };
  }

  const plugin: JsxA11yESLintPlugin;
  export default plugin;
}
