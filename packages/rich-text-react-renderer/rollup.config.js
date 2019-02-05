import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const inputFile = 'src/index.tsx';
const external = ['react'];

export default config(outputFile, inputFile, external);
