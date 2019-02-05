import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const inputFile = 'src/index.tsx';

export default config(outputFile, inputFile);
