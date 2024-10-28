import config from '../../rollup.config';
import { main as outputFile, dependencies } from './package.json';

export default config(outputFile, {
  external: Object.keys(dependencies),
});
