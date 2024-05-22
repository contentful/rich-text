import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const options = {
  input: `src/index.ts`,
  output: { file: pkg.main, format: 'cjs', sourcemap: true },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['@contentful/rich-text-types'],
  watch: {
    include: ['src/**'],
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
  ],
};

export default options;
