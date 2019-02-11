import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const overrides = {
  input: 'src/index.tsx',
  external: ['react'],
};

export default config(outputFile, overrides);
