import copy from 'rollup-plugin-copy';

import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const customConfig = () => {
  const baseConfig = config(outputFile);

  return {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      copy({
        "src/schemas/generated": "dist/lib/schemas/generated"
      })
    ]
  }
}

export default customConfig();
