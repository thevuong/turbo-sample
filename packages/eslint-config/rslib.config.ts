import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
      bundle: false,
      output: {
        distPath: {
          root: "./dist/esm",
        },
      },
    },
    {
      format: 'cjs',
      syntax: 'es2021',
      dts: true,
      bundle: false,
      output: {
        distPath: {
          root: "./dist/cjs",
        },
      },
    },
  ],
  source: {
    entry: {
      index: ["./src/**/*.{ts,tsx}", "!./src/**/*.{test,spec}.{ts,tsx}"],
    },
    tsconfigPath: "./tsconfig.build.json",
  },
  output: {
    target: 'node',
  },
});
