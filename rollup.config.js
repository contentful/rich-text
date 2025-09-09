import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import swc from '@rollup/plugin-swc';
import json from 'rollup-plugin-json';

export default (outputFile, overrides = {}) => ({
  input: 'src/index.ts',
  output: [
    {
      file: outputFile,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    json(),
    swc({
      swc: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2019',
          loose: false,
          minify: {
            compress: false,
            mangle: false,
          },
          experimental: {
            plugins: [
              [
                '@lingui/swc-plugin',
                {
                  stripNonEssentialFields: false,
                  runtimeModules: {
                    i18n: ['@lingui/core', 'i18n'],
                    trans: ['@lingui/react', 'Trans'],
                  },
                },
              ],
            ],
          },
        },
        minify: false,
      },
    }),
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
    }),
  ],
  ...overrides,
});
