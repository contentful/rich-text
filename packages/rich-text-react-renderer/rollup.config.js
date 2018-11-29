import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const customConfig = () => {
  const baseConfig = config(outputFile);

  return {
    ...baseConfig,
    input: 'src/index.tsx'
  }
}

export default customConfig();
